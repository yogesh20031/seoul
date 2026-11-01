import { beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../lib/prisma";
import { api, hoursFromNow, registerUser, resetDb } from "./helpers";

beforeAll(resetDb);

const createTour = (guideId: string, startsAt: Date) =>
  prisma.tour.create({
    data: {
      guideId,
      title: "Palace and hanok walk",
      description: "A description that is long enough to pass validation.",
      startsAt,
      durationMin: 120,
      meetingName: "Anguk Station Exit 2",
      meetingLat: 37.5766,
      meetingLng: 126.9854,
      capacity: 6,
      pricePerPerson: 30_000,
      status: "COMPLETED",
    },
  });

const payBooking = (tourId: string, travellerId: string) =>
  prisma.booking.create({
    data: {
      tourId,
      travellerId,
      seats: 1,
      amount: 30_000,
      status: "PAID",
      paidAt: new Date(),
    },
  });

describe("reviews", () => {
  it("only allows a review once the tour has ended, then recomputes the rating", async () => {
    const guide = await registerUser("GUIDE");
    const alice = await registerUser("TRAVELLER");
    const bob = await registerUser("TRAVELLER");

    const upcoming = await createTour(guide.user.id, hoursFromNow(48));
    const upcomingBooking = await payBooking(upcoming.id, alice.user.id);
    const tooEarly = await api()
      .post(`/api/v1/guides/${guide.user.id}/reviews`)
      .set(alice.auth)
      .send({ rating: 5, bookingId: upcomingBooking.id });
    expect(tooEarly.status).toBe(409);

    const past = await createTour(guide.user.id, hoursFromNow(-72));
    const aliceBooking = await payBooking(past.id, alice.user.id);
    const bobBooking = await payBooking(past.id, bob.user.id);

    const mine = await api().get("/api/v1/me/bookings").set(alice.auth);
    expect(
      mine.body.find((b: { id: string }) => b.id === aliceBooking.id).canReview,
    ).toBe(true);

    const notYours = await api()
      .post(`/api/v1/guides/${guide.user.id}/reviews`)
      .set(bob.auth)
      .send({ rating: 5, bookingId: aliceBooking.id });
    expect(notYours.status).toBe(403);

    const first = await api()
      .post(`/api/v1/guides/${guide.user.id}/reviews`)
      .set(alice.auth)
      .send({ rating: 5, comment: "Wonderful", bookingId: aliceBooking.id });
    expect(first.status).toBe(201);
    expect(first.body.author.id).toBe(alice.user.id);
    expect(first.body.guideRating).toEqual({ ratingAvg: 5, ratingCount: 1 });

    const duplicate = await api()
      .post(`/api/v1/guides/${guide.user.id}/reviews`)
      .set(alice.auth)
      .send({ rating: 1, bookingId: aliceBooking.id });
    expect(duplicate.status).toBe(409);

    const second = await api()
      .post(`/api/v1/guides/${guide.user.id}/reviews`)
      .set(bob.auth)
      .send({ rating: 4, bookingId: bobBooking.id });
    expect(second.body.guideRating).toEqual({ ratingAvg: 4.5, ratingCount: 2 });

    const profile = await api().get(`/api/v1/guides/${guide.user.id}`);
    expect(profile.body.ratingAvg).toBe(4.5);
    expect(profile.body.ratingCount).toBe(2);
    expect(profile.body.reviews).toHaveLength(2);
    expect(profile.body.ratingBreakdown).toEqual([
      { stars: 5, count: 1 },
      { stars: 4, count: 1 },
      { stars: 3, count: 0 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 },
    ]);

    const list = await api().get(`/api/v1/guides/${guide.user.id}/reviews`);
    expect(list.body).toHaveLength(2);

    const top = await api().get("/api/v1/guides/top");
    expect(top.body[0].id).toBe(guide.user.id);

    const after = await api().get("/api/v1/me/bookings").set(alice.auth);
    expect(
      after.body.find((b: { id: string }) => b.id === aliceBooking.id)
        .canReview,
    ).toBe(false);
  });

  it("rejects a review for a different guide", async () => {
    const guide = await registerUser("GUIDE");
    const otherGuide = await registerUser("GUIDE");
    const alice = await registerUser("TRAVELLER");
    const tour = await createTour(guide.user.id, hoursFromNow(-72));
    const booking = await payBooking(tour.id, alice.user.id);
    const res = await api()
      .post(`/api/v1/guides/${otherGuide.user.id}/reviews`)
      .set(alice.auth)
      .send({ rating: 5, bookingId: booking.id });
    expect(res.status).toBe(400);
  });

  it("counts every rating when reviews for one guide arrive at the same time", async () => {
    const guide = await registerUser("GUIDE");
    const past = await createTour(guide.user.id, hoursFromNow(-72));
    const travellers = await Promise.all(
      [5, 4, 3, 5, 2].map(async (rating) => {
        const traveller = await registerUser("TRAVELLER");
        const booking = await payBooking(past.id, traveller.user.id);
        return { traveller, booking, rating };
      }),
    );

    const responses = await Promise.all(
      travellers.map(({ traveller, booking, rating }) =>
        api()
          .post(`/api/v1/guides/${guide.user.id}/reviews`)
          .set(traveller.auth)
          .send({ rating, bookingId: booking.id }),
      ),
    );
    expect(responses.map((r) => r.status)).toEqual([201, 201, 201, 201, 201]);

    const profile = await api().get(`/api/v1/guides/${guide.user.id}`);
    expect(profile.body.ratingCount).toBe(5);
    expect(profile.body.ratingAvg).toBe(3.8);
  });
});
