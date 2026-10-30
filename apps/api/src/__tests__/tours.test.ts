import { beforeAll, describe, expect, it } from "vitest";
import {
  api,
  hoursFromNow,
  registerUser,
  resetDb,
  seedPlaces,
} from "./helpers";

beforeAll(resetDb);

const tourBody = (placeIds: string[]) => ({
  title: "Palace and hanok walk",
  description: "A description that is long enough to pass validation.",
  startsAt: hoursFromNow(72).toISOString(),
  durationMin: 120,
  meetingName: "Anguk Station Exit 2",
  meetingLat: 37.5766,
  meetingLng: 126.9854,
  capacity: 6,
  pricePerPerson: 30_000,
  placeIds,
});

describe("guide tour management", () => {
  it("keeps stops on a partial edit and replaces them only when placeIds is sent", async () => {
    const guide = await registerUser("GUIDE");
    const places = await seedPlaces();
    const created = await api()
      .post("/api/v1/tours")
      .set(guide.auth)
      .send(tourBody([places[0]!.id, places[1]!.id]));
    expect(created.status).toBe(201);
    expect(created.body.stops).toHaveLength(2);

    const renamed = await api()
      .patch(`/api/v1/tours/${created.body.id}`)
      .set(guide.auth)
      .send({ title: "Renamed palace walk" });
    expect(renamed.status).toBe(200);
    expect(renamed.body.title).toBe("Renamed palace walk");
    expect(renamed.body.stops).toHaveLength(2);

    const restopped = await api()
      .patch(`/api/v1/tours/${created.body.id}`)
      .set(guide.auth)
      .send({ placeIds: [places[2]!.id] });
    expect(
      restopped.body.stops.map((s: { place: { id: string } }) => s.place.id),
    ).toEqual([places[2]!.id]);
  });

  it("only lets the owning guide edit, and travellers can't create tours", async () => {
    const owner = await registerUser("GUIDE");
    const other = await registerUser("GUIDE");
    const traveller = await registerUser("TRAVELLER");
    const created = await api()
      .post("/api/v1/tours")
      .set(owner.auth)
      .send(tourBody([]));

    const stranger = await api()
      .patch(`/api/v1/tours/${created.body.id}`)
      .set(other.auth)
      .send({ capacity: 10 });
    expect(stranger.status).toBe(403);
    const asTraveller = await api()
      .post("/api/v1/tours")
      .set(traveller.auth)
      .send(tourBody([]));
    expect(asTraveller.status).toBe(403);
  });
});

describe("tour list", () => {
  it("filters to tours that stop at a given place", async () => {
    const guide = await registerUser("GUIDE");
    const places = await seedPlaces();
    const stopping = await api()
      .post("/api/v1/tours")
      .set(guide.auth)
      .send(tourBody([places[3]!.id]));
    await api()
      .post("/api/v1/tours")
      .set(guide.auth)
      .send(tourBody([places[4]!.id]));

    const res = await api()
      .get("/api/v1/tours")
      .query({ placeId: places[3]!.id });
    expect(res.status).toBe(200);
    expect(res.body.items.map((t: { id: string }) => t.id)).toEqual([
      stopping.body.id,
    ]);
  });
});
