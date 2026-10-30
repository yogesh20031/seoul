import { beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../lib/prisma";
import { api, hoursFromNow, registerUser, resetDb } from "./helpers";

beforeAll(resetDb);

const createTour = (
  guideId: string,
  overrides: { capacity?: number; startsAt?: Date } = {},
) =>
  prisma.tour.create({
    data: {
      guideId,
      title: "Palace and hanok walk",
      description: "A description that is long enough to pass validation.",
      startsAt: overrides.startsAt ?? hoursFromNow(72),
      durationMin: 120,
      meetingName: "Anguk Station Exit 2",
      meetingLat: 37.5766,
      meetingLng: 126.9854,
      capacity: overrides.capacity ?? 4,
      pricePerPerson: 30_000,
    },
  });

describe("booking flow (mock payments)", () => {
  it("books, shows members to logged-in viewers only, fills up and rejects overbooking", async () => {
    const guide = await registerUser("GUIDE");
    const alice = await registerUser("TRAVELLER", { name: "Alice" });
    const bob = await registerUser("TRAVELLER", { name: "Bob" });
    const carol = await registerUser("TRAVELLER", { name: "Carol" });
    const tour = await createTour(guide.user.id, { capacity: 4 });

    const booked = await api()
      .post(`/api/v1/tours/${tour.id}/bookings`)
      .set(alice.auth)
      .send({ seats: 2 });
    expect(booked.status).toBe(201);
    expect(booked.body.checkoutUrl).toContain("mock=1&kind=booking");

    const asAlice = await api().get(`/api/v1/tours/${tour.id}`).set(alice.auth);
    expect(asAlice.body.seatsTaken).toBe(2);
    expect(asAlice.body.status).toBe("OPEN");
    expect(asAlice.body.viewer.bookingStatus).toBe("PAID");
    expect(asAlice.body.members).toHaveLength(1);
    expect(asAlice.body.members[0]).toMatchObject({ name: "Alice", seats: 2 });
    expect(asAlice.body.members[0]).not.toHaveProperty("email");

    const anonymous = await api().get(`/api/v1/tours/${tour.id}`);
    expect(anonymous.body.members).toBeNull();
    expect(anonymous.body.memberPreview).toHaveLength(1);

    const asGuide = await api().get(`/api/v1/tours/${tour.id}`).set(guide.auth);
    expect(asGuide.body.viewer.isGuide).toBe(true);

    const tooMany = await api()
      .post(`/api/v1/tours/${tour.id}/bookings`)
      .set(bob.auth)
      .send({ seats: 3 });
    expect(tooMany.status).toBe(409);
    expect(tooMany.body.error.message).toBe("Only 2 seats left");

    const filling = await api()
      .post(`/api/v1/tours/${tour.id}/bookings`)
      .set(bob.auth)
      .send({ seats: 2 });
    expect(filling.status).toBe(201);
    const full = await api().get(`/api/v1/tours/${tour.id}`);
    expect(full.body.status).toBe("FULL");
    expect(
      (await prisma.tour.findUniqueOrThrow({ where: { id: tour.id } })).status,
    ).toBe("FULL");

    const late = await api()
      .post(`/api/v1/tours/${tour.id}/bookings`)
      .set(carol.auth)
      .send({ seats: 1 });
    expect(late.status).toBe(409);

    const again = await api()
      .post(`/api/v1/tours/${tour.id}/bookings`)
      .set(alice.auth)
      .send({ seats: 1 });
    expect(again.status).toBe(409);
  });

  it("never oversells the last seats under concurrent requests", async () => {
    const guide = await registerUser("GUIDE");
    const tour = await createTour(guide.user.id, { capacity: 2 });
    const travellers = await Promise.all(
      [1, 2, 3, 4].map(() => registerUser("TRAVELLER")),
    );

    const results = await Promise.all(
      travellers.map((t) =>
        api()
          .post(`/api/v1/tours/${tour.id}/bookings`)
          .set(t.auth)
          .send({ seats: 1 }),
      ),
    );
    expect(results.filter((r) => r.status === 201)).toHaveLength(2);
    expect(results.filter((r) => r.status === 409)).toHaveLength(2);
  });

  it("lists my bookings, newest first, and cancels with a refund when far enough away", async () => {
    const guide = await registerUser("GUIDE");
    const traveller = await registerUser("TRAVELLER");
    const tour = await createTour(guide.user.id);
    await api()
      .post(`/api/v1/tours/${tour.id}/bookings`)
      .set(traveller.auth)
      .send({ seats: 1 });

    const mine = await api().get("/api/v1/me/bookings").set(traveller.auth);
    expect(mine.body).toHaveLength(1);
    expect(mine.body[0]).toMatchObject({
      status: "PAID",
      canReview: false,
      amount: 30_000,
    });
    expect(
      await prisma.earning.count({ where: { bookingId: mine.body[0].id } }),
    ).toBe(1);

    const cancelled = await api()
      .post(`/api/v1/bookings/${mine.body[0].id}/cancel`)
      .set(traveller.auth);
    expect(cancelled.status).toBe(200);
    expect(cancelled.body.status).toBe("REFUNDED");
    expect(
      await prisma.earning.count({ where: { bookingId: mine.body[0].id } }),
    ).toBe(0);
    expect((await api().get(`/api/v1/tours/${tour.id}`)).body.seatsTaken).toBe(
      0,
    );
  });

  it("refuses to cancel within 24 hours", async () => {
    const guide = await registerUser("GUIDE");
    const traveller = await registerUser("TRAVELLER");
    const tour = await createTour(guide.user.id, { startsAt: hoursFromNow(5) });
    await api()
      .post(`/api/v1/tours/${tour.id}/bookings`)
      .set(traveller.auth)
      .send({ seats: 1 });
    const booking = await prisma.booking.findFirstOrThrow({
      where: { tourId: tour.id },
    });
    const res = await api()
      .post(`/api/v1/bookings/${booking.id}/cancel`)
      .set(traveller.auth);
    expect(res.status).toBe(409);
  });

  it("frees seats when a tour is cancelled and refunds paid bookings", async () => {
    const guide = await registerUser("GUIDE");
    const traveller = await registerUser("TRAVELLER");
    const tour = await createTour(guide.user.id);
    await api()
      .post(`/api/v1/tours/${tour.id}/bookings`)
      .set(traveller.auth)
      .send({ seats: 2 });

    const cancelled = await api()
      .post(`/api/v1/tours/${tour.id}/cancel`)
      .set(guide.auth);
    expect(cancelled.status).toBe(200);
    expect(cancelled.body.status).toBe("CANCELLED");
    expect(cancelled.body.seatsTaken).toBe(0);
    const booking = await prisma.booking.findFirstOrThrow({
      where: { tourId: tour.id },
    });
    expect(booking.status).toBe("REFUNDED");
    expect(
      await prisma.earning.count({ where: { bookingId: booking.id } }),
    ).toBe(0);
  });

  it("shows only upcoming open tours in the public list", async () => {
    await createTour((await registerUser("GUIDE")).user.id, {
      startsAt: hoursFromNow(-48),
    });
    const res = await api().get("/api/v1/tours");
    expect(res.status).toBe(200);
    expect(
      res.body.items.every(
        (t: { startsAt: string }) => new Date(t.startsAt) > new Date(),
      ),
    ).toBe(true);
  });
});
