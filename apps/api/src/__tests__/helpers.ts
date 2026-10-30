import type { AuthResponse, Role } from "@seoul/shared";
import request from "supertest";
import { createApp } from "../app";
import { prisma } from "../lib/prisma";

export const app = createApp();
export const api = () => request(app);

let counter = 0;

export const registerUser = async (
  role: Role,
  overrides: { email?: string; name?: string } = {},
) => {
  counter += 1;
  const email = overrides.email ?? `${role.toLowerCase()}${counter}@test.dev`;
  const res = await api()
    .post("/api/v1/auth/register")
    .send({
      email,
      password: "password123",
      name: overrides.name ?? `Test ${role} ${counter}`,
      role,
    });
  const body: AuthResponse = res.body;
  return { ...body, auth: { Authorization: `Bearer ${body.token}` } };
};

export const seedPlaces = async () => {
  const base = {
    descriptionEn: "d",
    descriptionKo: "d",
    address: "a",
    imageUrl: "https://picsum.photos/seed/x/10/10",
    tags: [],
  };
  const places = [
    {
      slug: "gyeongbokgung",
      nameEn: "Gyeongbokgung",
      nameKo: "경복궁",
      district: "Jongno-gu",
      lat: 37.5796,
      lng: 126.977,
    },
    {
      slug: "bukchon",
      nameEn: "Bukchon",
      nameKo: "북촌",
      district: "Jongno-gu",
      lat: 37.5826,
      lng: 126.983,
    },
    {
      slug: "insadong",
      nameEn: "Insadong",
      nameKo: "인사동",
      district: "Jongno-gu",
      lat: 37.574,
      lng: 126.985,
    },
    {
      slug: "n-tower",
      nameEn: "N Seoul Tower",
      nameKo: "N서울타워",
      district: "Yongsan-gu",
      lat: 37.5512,
      lng: 126.9882,
    },
    {
      slug: "myeongdong",
      nameEn: "Myeongdong",
      nameKo: "명동",
      district: "Jung-gu",
      lat: 37.5636,
      lng: 126.9822,
    },
  ];
  return Promise.all(
    places.map((p) =>
      prisma.place.upsert({
        where: { slug: p.slug },
        update: {},
        create: { ...base, ...p, category: "ATTRACTION", suggestedMinutes: 60 },
      }),
    ),
  );
};

export { hoursFromNow, resetDb } from "./db";
