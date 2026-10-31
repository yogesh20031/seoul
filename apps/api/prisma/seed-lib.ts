// Building blocks shared by the full seed (seed.ts) and the additive guide seed (seed-guides.ts).
import { splitAmount } from "@seoul/shared";
import { prisma } from "../src/lib/prisma";
import {
  addDays,
  addMinutesToDate,
  seoulInstant,
  seoulToday,
} from "../src/lib/time";
import type { GuideSeed, TravellerSeed } from "./seed-data/people";
import type { TourSeed } from "./seed-data/tours";

/** Seed users indexed like the `guides` / `travellers` arrays, which is how tour seeds refer to them. */
export type People = {
  guideUsers: { id: string }[];
  travellerUsers: { id: string }[];
};

export type RequirePlace = (slug: string) => { id: string; imageUrl: string };

export const PASSWORD = "password123";

const avatarFor = (email: string) =>
  `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`;

export const createGuideUser = (g: GuideSeed, passwordHash: string) =>
  prisma.user.create({
    data: {
      email: g.email,
      passwordHash,
      name: g.name,
      role: "GUIDE",
      country: g.country,
      bio: g.bio,
      avatarUrl: avatarFor(g.email),
      guideProfile: {
        create: {
          headline: g.headline,
          languages: g.languages,
          specialties: g.specialties,
          soloPrice: g.soloPrice,
          soloDurationMin: g.soloDurationMin,
          isVerified: g.isVerified,
        },
      },
    },
  });

export const createTravellerUser = (t: TravellerSeed, passwordHash: string) =>
  prisma.user.create({
    data: {
      email: t.email,
      passwordHash,
      name: t.name,
      role: "TRAVELLER",
      country: t.country,
      bio: t.bio,
      avatarUrl: avatarFor(t.email),
    },
  });

export const placeLookup = async (): Promise<RequirePlace> => {
  const placeRows = await prisma.place.findMany({
    select: { id: true, slug: true, imageUrl: true },
  });
  const placeBySlug = new Map(placeRows.map((p) => [p.slug, p]));
  return (slug) => {
    const place = placeBySlug.get(slug);
    if (!place) throw new Error(`Seed references unknown place "${slug}"`);
    return place;
  };
};

export const seedTours = async (
  tours: TourSeed[],
  people: People,
  requirePlace: RequirePlace,
  past: boolean,
) => {
  const now = new Date();
  for (const t of tours) {
    const guide = people.guideUsers[t.guide];
    if (!guide) throw new Error(`Unknown guide index ${t.guide}`);
    const startsAt = seoulInstant(
      seoulToday(addDays(now, t.dayOffset)),
      t.time,
    );
    const stops = t.stops.map(requirePlace);
    const seatsBooked = t.bookings.reduce((sum, b) => sum + b.seats, 0);

    const tour = await prisma.tour.create({
      data: {
        guideId: guide.id,
        title: t.title,
        description: t.description,
        startsAt,
        durationMin: t.durationMin,
        meetingName: t.meetingName,
        meetingLat: t.meetingLat,
        meetingLng: t.meetingLng,
        capacity: t.capacity,
        pricePerPerson: t.pricePerPerson,
        status: past
          ? "COMPLETED"
          : seatsBooked >= t.capacity
            ? "FULL"
            : "OPEN",
        coverImageUrl: stops[0]?.imageUrl ?? null,
        stops: {
          create: stops.map((place, order) => ({ placeId: place.id, order })),
        },
      },
    });

    for (const b of t.bookings) {
      const traveller = people.travellerUsers[b.traveller];
      if (!traveller) throw new Error(`Unknown traveller index ${b.traveller}`);
      const paidAt = addMinutesToDate(startsAt, -3 * 24 * 60);
      const amount = b.seats * t.pricePerPerson;
      const booking = await prisma.booking.create({
        data: {
          tourId: tour.id,
          travellerId: traveller.id,
          seats: b.seats,
          amount,
          status: "PAID",
          paidAt,
        },
      });
      await prisma.earning.create({
        data: {
          guideId: guide.id,
          bookingId: booking.id,
          status: past ? "AVAILABLE" : "PENDING",
          createdAt: paidAt,
          ...splitAmount(amount),
        },
      });
      if (b.rating) {
        await prisma.review.create({
          data: {
            guideId: guide.id,
            authorId: traveller.id,
            bookingId: booking.id,
            rating: b.rating,
            comment: b.comment ?? "",
            createdAt: addMinutesToDate(startsAt, t.durationMin + 6 * 60),
          },
        });
      }
    }
  }
};

// Ratings are derived from the seeded reviews so they can never drift from the data.
export const recomputeRatings = async (guideIds: string[]) => {
  for (const guideId of guideIds) {
    const stats = await prisma.review.aggregate({
      where: { guideId },
      _avg: { rating: true },
      _count: { _all: true },
    });
    await prisma.guideProfile.update({
      where: { userId: guideId },
      data: {
        ratingAvg: Math.round((stats._avg.rating ?? 0) * 100) / 100,
        ratingCount: stats._count._all,
      },
    });
  }
};
