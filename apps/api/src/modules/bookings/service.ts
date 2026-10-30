import type { Prisma } from "@prisma/client";
import type {
  Booking,
  CheckoutResponse,
  CreateBookingInput,
} from "@seoul/shared";
import { countSeatsTaken, recomputeTourStatus } from "../../lib/capacity";
import { conflict, forbidden, notFound } from "../../lib/http-error";
import { toTourCard, tourInclude } from "../../lib/mappers";
import { prisma } from "../../lib/prisma";
import { addMinutesToDate, endsAt, HOUR_MS } from "../../lib/time";
import {
  CHECKOUT_MINUTES,
  createBookingCheckout,
  expireCheckoutSession,
  refundPayment,
} from "../payments/service";

const bookingInclude = (now: Date) =>
  ({
    tour: { include: tourInclude(now) },
    review: true,
  }) satisfies Prisma.BookingInclude;

type BookingRow = Prisma.BookingGetPayload<{
  include: ReturnType<typeof bookingInclude>;
}>;

const toBooking = (row: BookingRow): Booking => ({
  id: row.id,
  seats: row.seats,
  amount: row.amount,
  status: row.status,
  createdAt: row.createdAt.toISOString(),
  tour: toTourCard(row.tour),
  canReview:
    row.status === "PAID" &&
    endsAt(row.tour.startsAt, row.tour.durationMin) < new Date() &&
    !row.review,
});

export const createBooking = async (
  travellerId: string,
  tourId: string,
  input: CreateBookingInput,
): Promise<CheckoutResponse> => {
  const now = new Date();

  const { booking, tour } = await prisma.$transaction(async (tx) => {
    // Row lock serialises concurrent bookings of the same tour, so the last seat can't be sold twice.
    const locked = await tx.$queryRaw<
      { id: string }[]
    >`SELECT id FROM "Tour" WHERE id = ${tourId} FOR UPDATE`;
    if (locked.length === 0) throw notFound("Tour");

    const tour = await tx.tour.findUniqueOrThrow({ where: { id: tourId } });
    if (
      (tour.status !== "OPEN" && tour.status !== "FULL") ||
      tour.startsAt <= now
    ) {
      throw conflict("This tour isn't open for booking");
    }

    const existing = await tx.booking.findUnique({
      where: { tourId_travellerId: { tourId, travellerId } },
    });
    if (existing?.status === "PAID")
      throw conflict("You've already booked this tour");

    const taken = await countSeatsTaken(tx, tourId, {
      now,
      excludeBookingId: existing?.id,
    });
    const remaining = Math.max(0, tour.capacity - taken);
    if (input.seats > remaining) throw conflict(`Only ${remaining} seats left`);

    const data = {
      seats: input.seats,
      amount: input.seats * tour.pricePerPerson,
      status: "PENDING_PAYMENT",
      holdExpiresAt: addMinutesToDate(now, CHECKOUT_MINUTES),
      stripeSessionId: null,
      stripePaymentIntentId: null,
      paidAt: null,
    } satisfies Prisma.BookingUncheckedUpdateInput;

    const booking = existing
      ? await tx.booking.update({ where: { id: existing.id }, data })
      : await tx.booking.create({ data: { ...data, tourId, travellerId } });
    await recomputeTourStatus(tx, tourId);
    return { booking, tour };
  });

  return createBookingCheckout(booking, tour, input.locale);
};

export const listMyBookings = async (travellerId: string) => {
  const rows = await prisma.booking.findMany({
    where: { travellerId },
    include: bookingInclude(new Date()),
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toBooking);
};

const CANCEL_CUTOFF_MS = 24 * HOUR_MS;

export const cancelBooking = async (travellerId: string, bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { tour: true },
  });
  if (!booking) throw notFound("Booking");
  if (booking.travellerId !== travellerId)
    throw forbidden("This isn't your booking");

  if (booking.status === "PENDING_PAYMENT") {
    await expireCheckoutSession(booking.stripeSessionId);
  } else if (booking.status === "PAID") {
    if (booking.tour.startsAt.getTime() - Date.now() <= CANCEL_CUTOFF_MS) {
      throw conflict(
        "Bookings can only be cancelled more than 24 hours before the tour",
      );
    }
    await refundPayment(booking.stripePaymentIntentId, booking.id);
  } else {
    throw conflict(`This booking is already ${booking.status.toLowerCase()}`);
  }

  const wasPaid = booking.status === "PAID";
  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: { status: wasPaid ? "REFUNDED" : "CANCELLED", holdExpiresAt: null },
    });
    if (wasPaid) await tx.earning.deleteMany({ where: { bookingId } });
    await recomputeTourStatus(tx, booking.tourId);
  });

  const fresh = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: bookingInclude(new Date()),
  });
  return toBooking(fresh);
};
