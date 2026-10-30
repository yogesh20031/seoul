import Stripe from "stripe";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { prisma } from "../lib/prisma";
import { hoursFromNow, resetDb } from "./db";

const SECRET = "whsec_test_secret";

vi.stubEnv("PAYMENTS_MODE", "stripe");
vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_dummy");
vi.stubEnv("STRIPE_WEBHOOK_SECRET", SECRET);

const { createApp } = await import("../app");
const app = createApp();

beforeAll(resetDb);
afterAll(() => vi.unstubAllEnvs());

const payload = (bookingId: string, type: string) =>
  JSON.stringify({
    id: "evt_test",
    object: "event",
    type,
    data: {
      object: {
        id: "cs_test",
        object: "checkout.session",
        payment_status: "paid",
        payment_intent: "pi_test",
        metadata: { kind: "booking", id: bookingId },
      },
    },
  });

const post = (body: string, signature: string) =>
  request(app)
    .post("/api/v1/webhooks/stripe")
    .set("Content-Type", "application/json")
    .set("Stripe-Signature", signature)
    .send(body);

describe("stripe webhook", () => {
  it("rejects an invalid signature with 400", async () => {
    const res = await post(
      payload("x", "checkout.session.completed"),
      "t=1,v1=bad",
    );
    expect(res.status).toBe(400);
  });

  it("rejects a missing signature with 400", async () => {
    const res = await request(app)
      .post("/api/v1/webhooks/stripe")
      .set("Content-Type", "application/json")
      .send("{}");
    expect(res.status).toBe(400);
  });

  it("marks a booking paid on a correctly signed completed event, idempotently", async () => {
    const guide = await prisma.user.create({
      data: {
        email: "g@test.dev",
        passwordHash: "x",
        name: "G",
        role: "GUIDE",
        guideProfile: { create: {} },
      },
    });
    const traveller = await prisma.user.create({
      data: {
        email: "t@test.dev",
        passwordHash: "x",
        name: "T",
        role: "TRAVELLER",
      },
    });
    const tour = await prisma.tour.create({
      data: {
        guideId: guide.id,
        title: "Webhook walk",
        description: "A description that is long enough to pass validation.",
        startsAt: hoursFromNow(72),
        durationMin: 120,
        meetingName: "Somewhere",
        meetingLat: 37.57,
        meetingLng: 126.98,
        capacity: 2,
        pricePerPerson: 20_000,
      },
    });
    const booking = await prisma.booking.create({
      data: {
        tourId: tour.id,
        travellerId: traveller.id,
        seats: 2,
        amount: 40_000,
        holdExpiresAt: hoursFromNow(1),
      },
    });

    const body = payload(booking.id, "checkout.session.completed");
    const signature = Stripe.webhooks.generateTestHeaderString({
      payload: body,
      secret: SECRET,
    });
    expect((await post(body, signature)).status).toBe(200);
    expect((await post(body, signature)).status).toBe(200);

    const paid = await prisma.booking.findUniqueOrThrow({
      where: { id: booking.id },
    });
    expect(paid).toMatchObject({
      status: "PAID",
      stripePaymentIntentId: "pi_test",
      holdExpiresAt: null,
    });
    expect(
      await prisma.earning.count({ where: { bookingId: booking.id } }),
    ).toBe(1);
    expect(
      (await prisma.tour.findUniqueOrThrow({ where: { id: tour.id } })).status,
    ).toBe("FULL");
  });
});
