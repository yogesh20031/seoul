import { Router, type RequestHandler } from "express";
import type Stripe from "stripe";
import { z } from "zod";
import { env } from "../../config/env";
import { badRequest, forbidden, notFound } from "../../lib/http-error";
import { logger } from "../../lib/logger";
import { prisma } from "../../lib/prisma";
import { getStripe } from "../../lib/stripe";
import { getAuth, requireAuth } from "../../middleware/auth";
import { parse } from "../../middleware/validate";
import { cancelExpiredBooking, markBookingPaid, markSoloPaid } from "./service";

export const paymentsRouter: Router = Router();

const metadataSchema = z.object({
  kind: z.enum(["booking", "solo"]),
  id: z.string().min(1),
});

const confirmSchema = z.object({ sessionId: z.string().min(1).max(200) });

const paymentIntentId = (session: Stripe.Checkout.Session) =>
  typeof session.payment_intent === "string"
    ? session.payment_intent
    : (session.payment_intent?.id ?? undefined);

paymentsRouter.post("/confirm", requireAuth, async (req, res) => {
  if (env.PAYMENTS_MODE !== "stripe")
    throw badRequest("Payments are mocked; there is nothing to confirm");
  const { userId } = getAuth(req);
  const { sessionId } = parse(confirmSchema, req.body);

  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  const meta = metadataSchema.safeParse(session.metadata);
  if (!meta.success) throw notFound("Checkout session");
  const { kind, id } = meta.data;

  if (kind === "booking") {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) throw notFound("Booking");
    if (booking.travellerId !== userId) throw forbidden();
    if (session.payment_status === "paid")
      await markBookingPaid(id, paymentIntentId(session));
    const fresh = await prisma.booking.findUnique({ where: { id } });
    res.json({ kind, id, status: fresh?.status ?? booking.status });
    return;
  }

  const solo = await prisma.soloRequest.findUnique({ where: { id } });
  if (!solo) throw notFound("Solo request");
  if (solo.travellerId !== userId) throw forbidden();
  if (session.payment_status === "paid") await markSoloPaid(id);
  const fresh = await prisma.soloRequest.findUnique({ where: { id } });
  res.json({ kind, id, status: fresh?.status ?? solo.status });
});

export const stripeWebhookHandler: RequestHandler = async (req, res) => {
  if (env.PAYMENTS_MODE !== "stripe") {
    res
      .status(404)
      .json({ error: { code: "NOT_FOUND", message: "Webhook not found" } });
    return;
  }

  const signature = req.headers["stripe-signature"];
  let event: Stripe.Event;
  try {
    if (typeof signature !== "string")
      throw new Error("Missing stripe-signature header");
    event = getStripe().webhooks.constructEvent(
      req.body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    logger.warn({ err }, "stripe webhook signature check failed");
    res
      .status(400)
      .json({ error: { code: "BAD_REQUEST", message: "Invalid signature" } });
    return;
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.expired"
  ) {
    const session = event.data.object;
    const meta = metadataSchema.safeParse(session.metadata);
    if (meta.success) {
      const { kind, id } = meta.data;
      if (
        event.type === "checkout.session.completed" &&
        session.payment_status === "paid"
      ) {
        if (kind === "booking")
          await markBookingPaid(id, paymentIntentId(session));
        else await markSoloPaid(id);
      }
      if (event.type === "checkout.session.expired" && kind === "booking")
        await cancelExpiredBooking(id);
    }
  }

  res.json({ received: true });
};
