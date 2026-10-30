import type { CheckoutResponse, Locale } from "@seoul/shared";
import { splitAmount } from "@seoul/shared";
import { env } from "../../config/env";
import { recomputeTourStatus } from "../../lib/capacity";
import { logger } from "../../lib/logger";
import { prisma } from "../../lib/prisma";
import { getStripe } from "../../lib/stripe";
import { addMinutesToDate } from "../../lib/time";

// Stripe's minimum Checkout lifetime is 30 minutes; the seat hold matches it so a late payment can't land after the seat is released.
export const CHECKOUT_MINUTES = 31;

type CheckoutKind = "booking" | "solo";

const mockCheckoutUrl = (locale: Locale, kind: CheckoutKind, id: string) =>
  `${env.webUrl}/${locale}/checkout/success?mock=1&kind=${kind}&id=${id}`;

const createSession = async (params: {
  kind: CheckoutKind;
  id: string;
  name: string;
  quantity: number;
  unitAmount: number;
  locale: Locale;
}) => {
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: params.quantity,
        price_data: {
          currency: "krw",
          unit_amount: params.unitAmount,
          product_data: { name: params.name },
        },
      },
    ],
    metadata: { kind: params.kind, id: params.id },
    client_reference_id: params.id,
    expires_at: Math.floor(
      addMinutesToDate(new Date(), CHECKOUT_MINUTES).getTime() / 1000,
    ),
    success_url: `${env.webUrl}/${params.locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.webUrl}/${params.locale}/checkout/cancel?kind=${params.kind}&id=${params.id}`,
  });
  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  return { sessionId: session.id, url: session.url };
};

export const createBookingCheckout = async (
  booking: { id: string; seats: number },
  tour: { title: string; pricePerPerson: number },
  locale: Locale,
): Promise<CheckoutResponse> => {
  if (env.PAYMENTS_MODE === "mock") {
    await markBookingPaid(booking.id);
    return { checkoutUrl: mockCheckoutUrl(locale, "booking", booking.id) };
  }
  const session = await createSession({
    kind: "booking",
    id: booking.id,
    name: tour.title,
    quantity: booking.seats,
    unitAmount: tour.pricePerPerson,
    locale,
  });
  await prisma.booking.update({
    where: { id: booking.id },
    data: { stripeSessionId: session.sessionId },
  });
  return { checkoutUrl: session.url };
};

export const createSoloCheckout = async (
  solo: { id: string; amount: number },
  guideName: string,
  locale: Locale,
): Promise<CheckoutResponse> => {
  if (env.PAYMENTS_MODE === "mock") {
    await markSoloPaid(solo.id);
    return { checkoutUrl: mockCheckoutUrl(locale, "solo", solo.id) };
  }
  const session = await createSession({
    kind: "solo",
    id: solo.id,
    name: `Private tour with ${guideName}`,
    quantity: 1,
    unitAmount: solo.amount,
    locale,
  });
  await prisma.soloRequest.update({
    where: { id: solo.id },
    data: { stripeSessionId: session.sessionId },
  });
  return { checkoutUrl: session.url };
};

export const markBookingPaid = async (
  bookingId: string,
  paymentIntentId?: string,
) => {
  await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      include: { tour: true },
    });
    if (!booking || booking.status === "PAID") return;
    if (booking.status !== "PENDING_PAYMENT") {
      logger.warn(
        { bookingId, status: booking.status },
        "payment received for a booking that is no longer pending",
      );
      return;
    }
    // The status guard makes concurrent webhook + confirm calls safe: only one of them flips the row.
    const flipped = await tx.booking.updateMany({
      where: { id: bookingId, status: "PENDING_PAYMENT" },
      data: {
        status: "PAID",
        paidAt: new Date(),
        holdExpiresAt: null,
        stripePaymentIntentId: paymentIntentId ?? null,
      },
    });
    if (flipped.count === 0) return;
    const split = splitAmount(booking.amount);
    await tx.earning.create({
      data: { guideId: booking.tour.guideId, bookingId, ...split },
    });
    await recomputeTourStatus(tx, booking.tourId);
  });
};

export const markSoloPaid = async (soloId: string) => {
  await prisma.$transaction(async (tx) => {
    const solo = await tx.soloRequest.findUnique({ where: { id: soloId } });
    if (!solo || solo.status === "PAID") return;
    if (solo.status !== "ACCEPTED") {
      logger.warn(
        { soloId, status: solo.status },
        "payment received for a solo request that is not accepted",
      );
      return;
    }
    const flipped = await tx.soloRequest.updateMany({
      where: { id: soloId, status: "ACCEPTED" },
      data: { status: "PAID", paidAt: new Date() },
    });
    if (flipped.count === 0) return;
    await tx.earning.create({
      data: {
        guideId: solo.guideId,
        soloRequestId: soloId,
        ...splitAmount(solo.amount),
      },
    });
  });
};

export const cancelExpiredBooking = async (bookingId: string) => {
  await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.status !== "PENDING_PAYMENT") return;
    await tx.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED", holdExpiresAt: null },
    });
    await recomputeTourStatus(tx, booking.tourId);
  });
};

/** No-op in mock mode or when there's no payment to return. */
export const refundPayment = async (
  paymentIntentId: string | null,
  bookingId: string,
) => {
  if (env.PAYMENTS_MODE !== "stripe" || !paymentIntentId) return;
  await getStripe().refunds.create(
    { payment_intent: paymentIntentId },
    { idempotencyKey: `refund-${bookingId}` },
  );
};

/** Best effort: stops a cancelled booking's Checkout page from taking money later. */
export const expireCheckoutSession = async (sessionId: string | null) => {
  if (env.PAYMENTS_MODE !== "stripe" || !sessionId) return;
  try {
    await getStripe().checkout.sessions.expire(sessionId);
  } catch (err) {
    logger.warn({ err, sessionId }, "could not expire checkout session");
  }
};
