import type { Prisma } from "@prisma/client";
import type {
  CreateTourInput,
  TourDetail,
  TourMember,
  TourQuery,
  UpdateTourInput,
} from "@seoul/shared";
import {
  activeBookingWhere,
  countSeatsTaken,
  recomputeTourStatus,
} from "../../lib/capacity";
import {
  badRequest,
  conflict,
  forbidden,
  notFound,
} from "../../lib/http-error";
import {
  toPublicUser,
  toTourCard,
  toTourDetail,
  tourInclude,
  type TourRow,
} from "../../lib/mappers";
import { pageArgs, toPaginated } from "../../lib/pagination";
import { prisma } from "../../lib/prisma";
import { addDays, endsAt, seoulInstant } from "../../lib/time";
import { tripsCounts } from "../../lib/trips";
import { expireCheckoutSession, refundPayment } from "../payments/service";
import { loadPlacesInOrder } from "../places/service";

export const listTours = async (query: TourQuery) => {
  const now = new Date();
  const where: Prisma.TourWhereInput = {
    status: { in: ["OPEN", "FULL"] },
    startsAt: {
      gt: now,
      ...(query.from ? { gte: seoulInstant(query.from) } : {}),
      ...(query.to ? { lt: addDays(seoulInstant(query.to), 1) } : {}),
    },
    ...(query.guideId ? { guideId: query.guideId } : {}),
    ...(query.placeId ? { stops: { some: { placeId: query.placeId } } } : {}),
    ...(query.q ? { title: { contains: query.q, mode: "insensitive" } } : {}),
  };
  const [rows, total] = await Promise.all([
    prisma.tour.findMany({
      where,
      include: tourInclude(now),
      orderBy: { startsAt: "asc" },
      ...pageArgs(query),
    }),
    prisma.tour.count({ where }),
  ]);
  return toPaginated(rows.map(toTourCard), total, query);
};

/** Batched so the dashboard and tour page share one path for member lists and the viewer's booking. */
export const buildTourDetails = async (
  rows: TourRow[],
  viewerId?: string,
): Promise<TourDetail[]> => {
  const now = new Date();
  const paidTravellers = rows.flatMap((row) =>
    row.bookings.filter((b) => b.status === "PAID").map((b) => b.traveller),
  );
  const counts = viewerId
    ? await tripsCounts(paidTravellers)
    : new Map<string, number>();
  const viewerBookings = viewerId
    ? await prisma.booking.findMany({
        where: {
          travellerId: viewerId,
          tourId: { in: rows.map((r) => r.id) },
          ...activeBookingWhere(now),
        },
      })
    : [];

  return rows.map((row) => {
    const members: TourMember[] | null = viewerId
      ? row.bookings
          .filter((b) => b.status === "PAID")
          .map((b) => ({
            ...toPublicUser(b.traveller, counts.get(b.travellerId) ?? 0),
            seats: b.seats,
          }))
      : null;
    const booking = viewerBookings.find((b) => b.tourId === row.id);
    return toTourDetail(row, members, {
      isGuide: viewerId === row.guideId,
      bookingId: booking?.id ?? null,
      bookingStatus: booking?.status ?? null,
    });
  });
};

export const getTourDetail = async (id: string, viewerId?: string) => {
  const row = await prisma.tour.findUnique({
    where: { id },
    include: tourInclude(new Date()),
  });
  if (!row) throw notFound("Tour");
  const [detail] = await buildTourDetails([row], viewerId);
  if (!detail) throw notFound("Tour");
  return detail;
};

export const createTour = async (guideId: string, input: CreateTourInput) => {
  const startsAt = new Date(input.startsAt);
  if (startsAt <= new Date())
    throw badRequest("A tour must start in the future");
  const places = await loadPlacesInOrder(input.placeIds);

  const tour = await prisma.tour.create({
    data: {
      guideId,
      title: input.title,
      description: input.description,
      startsAt,
      durationMin: input.durationMin,
      meetingName: input.meetingName,
      meetingLat: input.meetingLat,
      meetingLng: input.meetingLng,
      capacity: input.capacity,
      pricePerPerson: input.pricePerPerson,
      coverImageUrl: places[0]?.imageUrl ?? null,
      stops: {
        create: places.map((place, order) => ({ placeId: place.id, order })),
      },
    },
  });
  return getTourDetail(tour.id, guideId);
};

const findOwnedTour = async (guideId: string, id: string) => {
  const tour = await prisma.tour.findUnique({ where: { id } });
  if (!tour) throw notFound("Tour");
  if (tour.guideId !== guideId) throw forbidden("This isn't your tour");
  if (tour.status === "COMPLETED" || tour.status === "CANCELLED") {
    throw conflict(`A ${tour.status.toLowerCase()} tour can't be changed`);
  }
  // Status isn't flipped to COMPLETED in the DB (mappers derive it on read), so check the clock too.
  if (endsAt(tour.startsAt, tour.durationMin) < new Date())
    throw conflict("A completed tour can't be changed");
  return tour;
};

export const updateTour = async (
  guideId: string,
  id: string,
  input: UpdateTourInput,
) => {
  await findOwnedTour(guideId, id);
  if (input.startsAt && new Date(input.startsAt) <= new Date())
    throw badRequest("A tour must start in the future");
  const places = input.placeIds
    ? await loadPlacesInOrder(input.placeIds)
    : null;

  await prisma.$transaction(async (tx) => {
    // Lock the row so a booking racing this edit can't push seatsTaken past the new capacity.
    await tx.$queryRaw`SELECT id FROM "Tour" WHERE id = ${id} FOR UPDATE`;
    if (input.capacity !== undefined) {
      const taken = await countSeatsTaken(tx, id);
      if (input.capacity < taken)
        throw conflict(`${taken} seats are already taken`);
    }
    await tx.tour.update({
      where: { id },
      data: {
        title: input.title,
        description: input.description,
        startsAt: input.startsAt ? new Date(input.startsAt) : undefined,
        durationMin: input.durationMin,
        meetingName: input.meetingName,
        meetingLat: input.meetingLat,
        meetingLng: input.meetingLng,
        capacity: input.capacity,
        pricePerPerson: input.pricePerPerson,
        ...(places ? { coverImageUrl: places[0]?.imageUrl ?? null } : {}),
      },
    });
    if (places) {
      await tx.tourStop.deleteMany({ where: { tourId: id } });
      await tx.tourStop.createMany({
        data: places.map((place, order) => ({
          tourId: id,
          placeId: place.id,
          order,
        })),
      });
    }
    await recomputeTourStatus(tx, id);
  });
  return getTourDetail(id, guideId);
};

export const cancelTour = async (guideId: string, id: string) => {
  await findOwnedTour(guideId, id);
  const bookings = await prisma.booking.findMany({
    where: { tourId: id, status: { in: ["PAID", "PENDING_PAYMENT"] } },
  });
  const paid = bookings.filter((b) => b.status === "PAID");

  // Refund first: if Stripe fails we abort with the tour still open rather than cancel it with money held.
  for (const booking of paid)
    await refundPayment(booking.stripePaymentIntentId, booking.id);
  for (const booking of bookings.filter(
    (b) => b.status === "PENDING_PAYMENT",
  )) {
    await expireCheckoutSession(booking.stripeSessionId);
  }

  await prisma.$transaction([
    prisma.booking.updateMany({
      where: { id: { in: paid.map((b) => b.id) } },
      data: { status: "REFUNDED" },
    }),
    prisma.booking.updateMany({
      where: { tourId: id, status: "PENDING_PAYMENT" },
      data: { status: "CANCELLED", holdExpiresAt: null },
    }),
    prisma.earning.deleteMany({
      where: { bookingId: { in: paid.map((b) => b.id) } },
    }),
    prisma.tour.update({ where: { id }, data: { status: "CANCELLED" } }),
  ]);
  return getTourDetail(id, guideId);
};
