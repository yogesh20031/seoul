import { beforeAll, describe, expect, it } from "vitest";
import { api, registerUser, resetDb, seedPlaces } from "./helpers";

beforeAll(resetDb);

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

describe("itineraries", () => {
  it("plans all stops with increasing arrival times", async () => {
    const places = await seedPlaces();
    const res = await api()
      .post("/api/v1/itineraries/plan")
      .send({ placeIds: places.map((p) => p.id), startTime: "09:00" });
    expect(res.status).toBe(200);
    expect(res.body.stops).toHaveLength(5);
    expect(res.body.stops[0]).toMatchObject({
      arriveAt: "09:00",
      travelMin: 0,
      mode: null,
    });
    const arrivals: number[] = res.body.stops.map((s: { arriveAt: string }) =>
      toMinutes(s.arriveAt),
    );
    arrivals
      .slice(1)
      .forEach((minutes, i) => expect(minutes).toBeGreaterThan(arrivals[i]!));
    expect(res.body.endsAt).toBe(res.body.stops[4].leaveAt);
    expect(res.body.totalTravelMin).toBe(
      res.body.stops.reduce(
        (sum: number, s: { travelMin: number }) => sum + s.travelMin,
        0,
      ),
    );
  });

  it("travels from the start point to the first stop when given one", async () => {
    const places = await seedPlaces();
    const res = await api()
      .post("/api/v1/itineraries/plan")
      .send({
        placeIds: places.map((p) => p.id),
        start: { lat: 37.5665, lng: 126.978 },
        startTime: "10:00",
      });
    expect(res.body.stops[0].travelMin).toBeGreaterThan(0);
    expect(res.body.stops[0].mode).not.toBeNull();
  });

  it("rejects unknown places", async () => {
    const places = await seedPlaces();
    const res = await api()
      .post("/api/v1/itineraries/plan")
      .send({ placeIds: [places[0]!.id, "missing"] });
    expect(res.status).toBe(400);
  });

  it("saves, lists and shares an itinerary", async () => {
    const places = await seedPlaces();
    const user = await registerUser("TRAVELLER");
    const anonymous = await api()
      .post("/api/v1/itineraries")
      .send({ title: "Day one", placeIds: places.map((p) => p.id) });
    expect(anonymous.status).toBe(401);

    const saved = await api()
      .post("/api/v1/itineraries")
      .set(user.auth)
      .send({
        title: "Day one",
        placeIds: places.slice(0, 3).map((p) => p.id),
        date: "2030-05-01",
      });
    expect(saved.status).toBe(201);
    expect(saved.body.shareToken).toHaveLength(10);
    expect(saved.body.stops).toHaveLength(3);

    const mine = await api().get("/api/v1/itineraries/mine").set(user.auth);
    expect(mine.body).toHaveLength(1);

    const shared = await api().get(
      `/api/v1/itineraries/${saved.body.shareToken}`,
    );
    expect(shared.status).toBe(200);
    expect(shared.body.title).toBe("Day one");
    expect((await api().get("/api/v1/itineraries/does-not-exist")).status).toBe(
      404,
    );
  });
});
