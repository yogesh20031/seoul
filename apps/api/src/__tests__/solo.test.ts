import { splitAmount } from "@seoul/shared";
import { beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../lib/prisma";
import { api, registerUser, resetDb } from "./helpers";

beforeAll(resetDb);

const tomorrow = () =>
  new Date(Date.now() + 2 * 86_400_000).toISOString().slice(0, 10);

describe("solo requests", () => {
  it("goes request -> accept -> pay and records a 15% platform fee", async () => {
    const guide = await registerUser("GUIDE");
    const traveller = await registerUser("TRAVELLER");
    await api()
      .put("/api/v1/guides/me")
      .set(guide.auth)
      .send({
        headline: "Palaces and tea",
        languages: ["English"],
        specialties: ["Palaces & history"],
        soloPrice: 100_000,
        soloDurationMin: 240,
      });

    const created = await api()
      .post(`/api/v1/guides/${guide.user.id}/solo-requests`)
      .set(traveller.auth)
      .send({ date: tomorrow(), startTime: "10:00", note: "Hello" });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({
      status: "PENDING",
      amount: 100_000,
      durationMin: 240,
    });

    const earlyPay = await api()
      .post(`/api/v1/solo-requests/${created.body.id}/pay`)
      .set(traveller.auth)
      .send({});
    expect(earlyPay.status).toBe(409);

    const wrongGuide = await registerUser("GUIDE");
    const body = {
      meetingName: "Anguk Station Exit 2",
      meetingLat: 37.5766,
      meetingLng: 126.9854,
    };
    const forbidden = await api()
      .post(`/api/v1/solo-requests/${created.body.id}/accept`)
      .set(wrongGuide.auth)
      .send(body);
    expect(forbidden.status).toBe(403);

    const accepted = await api()
      .post(`/api/v1/solo-requests/${created.body.id}/accept`)
      .set(guide.auth)
      .send(body);
    expect(accepted.status).toBe(200);
    expect(accepted.body.status).toBe("ACCEPTED");

    const paid = await api()
      .post(`/api/v1/solo-requests/${created.body.id}/pay`)
      .set(traveller.auth)
      .send({ locale: "ko" });
    expect(paid.status).toBe(200);
    expect(paid.body.checkoutUrl).toContain(
      "/ko/checkout/success?mock=1&kind=solo",
    );

    const earning = await prisma.earning.findFirstOrThrow({
      where: { soloRequestId: created.body.id },
    });
    expect(earning).toMatchObject(splitAmount(100_000));
    expect(earning.platformFee).toBe(15_000);
    expect(earning.net).toBe(85_000);

    const mine = await api()
      .get("/api/v1/me/solo-requests")
      .set(traveller.auth);
    expect(mine.body[0].status).toBe("PAID");
    const theirs = await api().get("/api/v1/me/solo-requests").set(guide.auth);
    expect(theirs.body).toHaveLength(1);

    const overview = await api().get("/api/v1/guide/overview").set(guide.auth);
    expect(overview.status).toBe(200);
    expect(overview.body.earnings.totalNet).toBe(85_000);
    expect(overview.body.earnings.recent[0].label).toContain("Private tour");
    expect(overview.body.stats.travellersHosted).toBe(1);
  });

  it("lets a guide decline and a traveller cancel", async () => {
    const guide = await registerUser("GUIDE");
    const traveller = await registerUser("TRAVELLER");
    const make = () =>
      api()
        .post(`/api/v1/guides/${guide.user.id}/solo-requests`)
        .set(traveller.auth)
        .send({ date: tomorrow(), startTime: "09:00" });
    const first = await make();
    const declined = await api()
      .post(`/api/v1/solo-requests/${first.body.id}/decline`)
      .set(guide.auth);
    expect(declined.body.status).toBe("DECLINED");
    const second = await make();
    const cancelled = await api()
      .post(`/api/v1/solo-requests/${second.body.id}/cancel`)
      .set(traveller.auth);
    expect(cancelled.body.status).toBe("CANCELLED");
  });

  it("rejects dates in the past", async () => {
    const guide = await registerUser("GUIDE");
    const traveller = await registerUser("TRAVELLER");
    const res = await api()
      .post(`/api/v1/guides/${guide.user.id}/solo-requests`)
      .set(traveller.auth)
      .send({ date: "2020-01-01", startTime: "09:00" });
    expect(res.status).toBe(400);
  });
});
