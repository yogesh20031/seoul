import type { Prisma } from "@prisma/client";

// Unpaid bookings only hold their seats until holdExpiresAt, so an abandoned checkout frees the seat on its own.
export const activeBookingWhere = (now: Date) =>
  ({
    OR: [
      { status: "PAID" },
      { status: "PENDING_PAYMENT", holdExpiresAt: { gt: now } },
    ],
  }) satisfies Prisma.BookingWhereInput;

export const countSeatsTaken = async (
  db: Prisma.TransactionClient,
  tourId: string,
  {
    now = new Date(),
    excludeBookingId,
  }: { now?: Date; excludeBookingId?: string } = {},
) => {
  const result = await db.booking.aggregate({
    _sum: { seats: true },
    where: {
      tourId,
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
      ...activeBookingWhere(now),
    },
  });
  return result._sum.seats ?? 0;
};

export const recomputeTourStatus = async (
  db: Prisma.TransactionClient,
  tourId: string,
) => {
  const tour = await db.tour.findUnique({ where: { id: tourId } });
  if (!tour || (tour.status !== "OPEN" && tour.status !== "FULL")) return;
  const taken = await countSeatsTaken(db, tourId);
  const next = taken >= tour.capacity ? "FULL" : "OPEN";
  if (next !== tour.status)
    await db.tour.update({ where: { id: tourId }, data: { status: next } });
};
