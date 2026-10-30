import { beforeAll, describe, expect, it } from "vitest";
import { api, registerUser, resetDb, seedPlaces } from "./helpers";

beforeAll(resetDb);

describe("auth", () => {
  it("registers, logs in and returns the current user", async () => {
    const registered = await api().post("/api/v1/auth/register").send({
      email: "Ada@Example.com",
      password: "password123",
      name: "Ada",
      role: "TRAVELLER",
    });
    expect(registered.status).toBe(201);
    expect(registered.body.user.email).toBe("ada@example.com");
    expect(registered.body.token).toEqual(expect.any(String));

    const login = await api()
      .post("/api/v1/auth/login")
      .send({ email: "ada@example.com", password: "password123" });
    expect(login.status).toBe(200);

    const me = await api()
      .get("/api/v1/auth/me")
      .set("Authorization", `Bearer ${login.body.token}`);
    expect(me.status).toBe(200);
    expect(me.body).toMatchObject({
      email: "ada@example.com",
      role: "TRAVELLER",
      locale: "en",
    });
  });

  it("creates a guide profile for guides", async () => {
    const guide = await registerUser("GUIDE");
    const res = await api().get(`/api/v1/guides/${guide.user.id}`);
    expect(res.status).toBe(200);
    expect(res.body.languages.length).toBeGreaterThan(0);
  });

  it("rejects a duplicate email with 409", async () => {
    const res = await api().post("/api/v1/auth/register").send({
      email: "ada@example.com",
      password: "password123",
      name: "Ada Again",
      role: "TRAVELLER",
    });
    expect(res.status).toBe(409);
  });

  it("gives the same 401 for a wrong password and an unknown email", async () => {
    const wrongPassword = await api()
      .post("/api/v1/auth/login")
      .send({ email: "ada@example.com", password: "nope-nope" });
    const unknown = await api()
      .post("/api/v1/auth/login")
      .send({ email: "ghost@example.com", password: "password123" });
    expect(wrongPassword.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect(wrongPassword.body.error.message).toBe("Invalid email or password");
    expect(unknown.body.error.message).toBe("Invalid email or password");
  });

  it("rejects invalid input with 400", async () => {
    const res = await api()
      .post("/api/v1/auth/register")
      .send({ email: "bad", password: "x", name: "A", role: "ADMIN" });
    expect(res.status).toBe(400);
  });
});

describe("role-based access", () => {
  const tourBody = (placeIds: string[]) => ({
    title: "Test walking tour",
    description: "A description that is long enough to pass validation.",
    startsAt: new Date(Date.now() + 3 * 86_400_000).toISOString(),
    durationMin: 120,
    meetingName: "Anguk Station Exit 2",
    meetingLat: 37.5766,
    meetingLng: 126.9854,
    capacity: 6,
    pricePerPerson: 30_000,
    placeIds,
  });

  it("blocks travellers from creating tours", async () => {
    const traveller = await registerUser("TRAVELLER");
    const res = await api()
      .post("/api/v1/tours")
      .set(traveller.auth)
      .send(tourBody([]));
    expect(res.status).toBe(403);
  });

  it("blocks guides from booking tours", async () => {
    const guide = await registerUser("GUIDE");
    const created = await api()
      .post("/api/v1/tours")
      .set(guide.auth)
      .send(tourBody([]));
    expect(created.status).toBe(201);
    const res = await api()
      .post(`/api/v1/tours/${created.body.id}/bookings`)
      .set(guide.auth)
      .send({ seats: 1 });
    expect(res.status).toBe(403);
  });

  it("requires a token", async () => {
    const res = await api().post("/api/v1/tours").send(tourBody([]));
    expect(res.status).toBe(401);
    expect((await api().get("/api/v1/me/bookings")).status).toBe(401);
    expect((await api().get("/api/v1/guide/overview")).status).toBe(401);
  });

  it("rejects unknown places and past start times with 400", async () => {
    const guide = await registerUser("GUIDE");
    const places = await seedPlaces();
    const unknown = await api()
      .post("/api/v1/tours")
      .set(guide.auth)
      .send(tourBody(["nope"]));
    expect(unknown.status).toBe(400);
    const past = await api()
      .post("/api/v1/tours")
      .set(guide.auth)
      .send({
        ...tourBody([places[0]!.id]),
        startsAt: new Date(Date.now() - 86_400_000).toISOString(),
      });
    expect(past.status).toBe(400);
  });

  it("only lets the owning guide edit a tour and keeps stops on partial edits", async () => {
    const owner = await registerUser("GUIDE");
    const other = await registerUser("GUIDE");
    const places = await seedPlaces();
    const created = await api()
      .post("/api/v1/tours")
      .set(owner.auth)
      .send(tourBody([places[0]!.id, places[1]!.id]));
    expect(created.body.stops).toHaveLength(2);
    expect(created.body.coverImageUrl).toBe(places[0]!.imageUrl);

    const forbidden = await api()
      .patch(`/api/v1/tours/${created.body.id}`)
      .set(other.auth)
      .send({ capacity: 4 });
    expect(forbidden.status).toBe(403);

    const edited = await api()
      .patch(`/api/v1/tours/${created.body.id}`)
      .set(owner.auth)
      .send({ capacity: 4 });
    expect(edited.status).toBe(200);
    expect(edited.body.capacity).toBe(4);
    expect(edited.body.stops).toHaveLength(2);
  });
});
