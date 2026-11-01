// Demo data for local development. Every seeded account uses the password "password123".
// Wipes and recreates everything, so it refuses to run in production unless SEED_FORCE=1.
import { splitAmount } from "@seoul/shared";
import { hashPassword } from "../src/lib/password";
import { logger } from "../src/lib/logger";
import { prisma } from "../src/lib/prisma";
import { addDays, seoulToday } from "../src/lib/time";
import { attractions } from "./seed-data/attractions";
import { dishes } from "./seed-data/dishes";
import { hotels } from "./seed-data/hotels";
import { detailsFor } from "./seed-data/place-details";
import { guides, travellers } from "./seed-data/people";
import { photoFor } from "./seed-data/photos";
import { restaurants } from "./seed-data/restaurants";
import { pastTours, unratedTours, upcomingTours } from "./seed-data/tours";
import { transport } from "./seed-data/transport";
import {
  PASSWORD,
  createGuideUser,
  createTravellerUser,
  placeLookup,
  recomputeRatings,
  seedTours,
  type People,
} from "./seed-lib";

if (process.env.NODE_ENV === "production" && process.env.SEED_FORCE !== "1") {
  throw new Error(
    "Refusing to seed in production. Set SEED_FORCE=1 if you really mean it.",
  );
}

const wipe = async () => {
  await prisma.review.deleteMany();
  await prisma.earning.deleteMany();
  await prisma.itineraryStop.deleteMany();
  await prisma.itinerary.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.soloRequest.deleteMany();
  await prisma.tourStop.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.dish.deleteMany();
  await prisma.place.deleteMany();
  await prisma.transportGuide.deleteMany();
  await prisma.guideProfile.deleteMany();
  await prisma.user.deleteMany();
};

const seedContent = async () => {
  const places = [...attractions, ...restaurants, ...hotels];
  await prisma.place.createMany({
    data: places.map((p) => ({
      ...p,
      ...detailsFor(p.slug),
      // Stable ids, so cached place lists and saved planner links keep working after a re-seed.
      id: `place-${p.slug}`,
      imageUrl: photoFor(p.slug).url,
      imageCredit: photoFor(p.slug).credit,
    })),
  });
  const requirePlace = await placeLookup();

  for (const { restaurantSlugs, ...dish } of dishes) {
    await prisma.dish.create({
      data: {
        ...dish,
        id: `dish-${dish.slug}`,
        imageUrl: photoFor(dish.slug).url,
        imageCredit: photoFor(dish.slug).credit,
        whereToEat: {
          connect: restaurantSlugs.map((slug) => ({
            id: requirePlace(slug).id,
          })),
        },
      },
    });
  }
  await prisma.transportGuide.createMany({
    data: transport.map((guide) => ({
      ...guide,
      id: `transport-${guide.slug}`,
    })),
  });
  return requirePlace;
};

const seedPeople = async (): Promise<People> => {
  const passwordHash = await hashPassword(PASSWORD);
  const guideUsers = [];
  for (const g of guides)
    guideUsers.push(await createGuideUser(g, passwordHash));
  const travellerUsers = [];
  for (const t of travellers) {
    travellerUsers.push(await createTravellerUser(t, passwordHash));
  }
  return { guideUsers, travellerUsers };
};

type SoloSeed = {
  traveller: number;
  guide: number;
  dayOffset: number;
  startTime: string;
  status:
    "PENDING" | "ACCEPTED" | "PAID" | "DECLINED" | "CANCELLED" | "COMPLETED";
  note: string;
  review?: { rating: number; comment: string };
};

const soloSeeds: SoloSeed[] = [
  {
    traveller: 0,
    guide: 0,
    dayOffset: 10,
    startTime: "10:00",
    status: "PENDING",
    note: "We would love a slow morning covering Changdeokgung and a tea house.",
  },
  {
    traveller: 1,
    guide: 2,
    dayOffset: 8,
    startTime: "13:00",
    status: "ACCEPTED",
    note: "Show me the filming locations from my favourite drama!",
  },
  {
    traveller: 4,
    guide: 1,
    dayOffset: 6,
    startTime: "17:00",
    status: "PAID",
    note: "Street food dinner, vegetarian-friendly if possible.",
  },
  {
    traveller: 6,
    guide: 4,
    dayOffset: 9,
    startTime: "09:00",
    status: "DECLINED",
    note: "Bukhansan hike for beginners.",
  },
  {
    traveller: 5,
    guide: 3,
    dayOffset: 12,
    startTime: "11:00",
    status: "CANCELLED",
    note: "Architecture and cafes in Seongsu.",
  },
  {
    traveller: 2,
    guide: 0,
    dayOffset: -15,
    startTime: "10:00",
    status: "COMPLETED",
    note: "Hanok and palace day for two.",
    review: {
      rating: 5,
      comment:
        "A perfectly tailored day. Minji even found us a hidden tea room.",
    },
  },
  {
    traveller: 3,
    guide: 2,
    dayOffset: -9,
    startTime: "14:00",
    status: "PAID",
    note: "Photography-focused afternoon.",
    review: {
      rating: 5,
      comment: "Yuki planned a route with golden-hour light at every stop.",
    },
  },
];

const seedSolo = async (people: People) => {
  const now = new Date();
  for (const s of soloSeeds) {
    const traveller = people.travellerUsers[s.traveller];
    const guideUser = people.guideUsers[s.guide];
    const guideSeed = guides[s.guide];
    if (!traveller || !guideUser || !guideSeed)
      throw new Error("Bad solo seed indices");
    const hasMeeting = ["ACCEPTED", "PAID", "COMPLETED"].includes(s.status);
    const date = seoulToday(addDays(now, s.dayOffset));
    const paid = s.status === "PAID" || s.status === "COMPLETED";

    const solo = await prisma.soloRequest.create({
      data: {
        travellerId: traveller.id,
        guideId: guideUser.id,
        date,
        startTime: s.startTime,
        durationMin: guideSeed.soloDurationMin,
        note: s.note,
        amount: guideSeed.soloPrice,
        status: s.status,
        ...(hasMeeting
          ? {
              meetingName: "Anguk Station Exit 2",
              meetingLat: 37.5766,
              meetingLng: 126.9854,
            }
          : {}),
        paidAt: paid ? addDays(now, Math.min(s.dayOffset, 0) - 2) : null,
      },
    });
    if (paid) {
      await prisma.earning.create({
        data: {
          guideId: guideUser.id,
          soloRequestId: solo.id,
          status: s.dayOffset < 0 ? "AVAILABLE" : "PENDING",
          ...splitAmount(guideSeed.soloPrice),
        },
      });
    }
    if (s.review) {
      await prisma.review.create({
        data: {
          guideId: guideUser.id,
          authorId: traveller.id,
          soloRequestId: solo.id,
          ...s.review,
        },
      });
    }
  }
};

const main = async () => {
  await wipe();
  const requirePlace = await seedContent();
  const people = await seedPeople();
  await seedTours(pastTours, people, requirePlace, true);
  await seedTours(unratedTours, people, requirePlace, true);
  await seedTours(upcomingTours, people, requirePlace, false);
  await seedSolo(people);
  await recomputeRatings(people.guideUsers.map((g) => g.id));

  const [places, tours, reviews] = await Promise.all([
    prisma.place.count(),
    prisma.tour.count(),
    prisma.review.count(),
  ]);
  logger.info(
    `Seeded ${places} places, ${dishes.length} dishes, ${tours} tours, ${reviews} reviews.`,
  );
};

main()
  .catch((err) => {
    logger.error({ err }, "seed failed");
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
