import type { Prisma } from "@prisma/client";
import {
  RATING_STARS,
  type GuideDetail,
  type GuideQuery,
  type UpdateGuideProfileInput,
} from "@seoul/shared";
import { notFound } from "../../lib/http-error";
import {
  guideCardInclude,
  toGuideCard,
  toReview,
  toTourCard,
  tourInclude,
} from "../../lib/mappers";
import { pageArgs, toPaginated } from "../../lib/pagination";
import { prisma } from "../../lib/prisma";
import { countToursLed } from "../../lib/trips";

const capitalise = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

// Seed values are stored capitalised, so match the input as typed and in its canonical form.
const hasInsensitive = (value: string) => ({
  hasSome: [...new Set([value, capitalise(value)])],
});

const orderBy = (
  sort: GuideQuery["sort"],
): Prisma.GuideProfileOrderByWithRelationInput[] => {
  switch (sort) {
    case "price_asc":
      return [{ soloPrice: "asc" }];
    case "price_desc":
      return [{ soloPrice: "desc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    case "rating":
      return [{ ratingAvg: "desc" }, { ratingCount: "desc" }];
  }
};

export const listGuides = async (query: GuideQuery) => {
  const now = new Date();
  const where: Prisma.GuideProfileWhereInput = {
    ...(query.q
      ? {
          OR: [
            { user: { name: { contains: query.q, mode: "insensitive" } } },
            { headline: { contains: query.q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(query.language ? { languages: hasInsensitive(query.language) } : {}),
    ...(query.specialty
      ? { specialties: hasInsensitive(query.specialty) }
      : {}),
    ...(query.minRating !== undefined
      ? { ratingAvg: { gte: query.minRating } }
      : {}),
    ...(query.maxPrice !== undefined
      ? { soloPrice: { lte: query.maxPrice } }
      : {}),
  };
  const [rows, total] = await Promise.all([
    prisma.guideProfile.findMany({
      where,
      include: guideCardInclude(now),
      orderBy: orderBy(query.sort),
      ...pageArgs(query),
    }),
    prisma.guideProfile.count({ where }),
  ]);
  return toPaginated(rows.map(toGuideCard), total, query);
};

const TOP_GUIDES = 8;

export const topGuides = async () => {
  const rows = await prisma.guideProfile.findMany({
    where: { ratingCount: { gte: 1 } },
    include: guideCardInclude(new Date()),
    orderBy: [{ ratingAvg: "desc" }, { ratingCount: "desc" }],
    take: TOP_GUIDES,
  });
  return rows.map(toGuideCard);
};

export const getGuide = async (id: string): Promise<GuideDetail> => {
  const now = new Date();
  const row = await prisma.guideProfile.findUnique({
    where: { userId: id },
    include: guideCardInclude(now),
  });
  if (!row) throw notFound("Guide");
  const [tours, reviews, toursLed, starCounts] = await Promise.all([
    prisma.tour.findMany({
      where: {
        guideId: id,
        status: { in: ["OPEN", "FULL"] },
        startsAt: { gt: now },
      },
      include: tourInclude(now),
      orderBy: { startsAt: "asc" },
    }),
    prisma.review.findMany({
      where: { guideId: id },
      include: { author: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    countToursLed(id),
    prisma.review.groupBy({
      by: ["rating"],
      where: { guideId: id },
      _count: { _all: true },
    }),
  ]);
  const countFor = new Map(
    starCounts.map((row) => [row.rating, row._count._all]),
  );
  return {
    ...toGuideCard(row),
    bio: row.user.bio,
    country: row.user.country,
    memberSince: row.user.createdAt.toISOString(),
    toursLed,
    upcomingTours: tours.map(toTourCard),
    reviews: reviews.map(toReview),
    ratingBreakdown: RATING_STARS.map((stars) => ({
      stars,
      count: countFor.get(stars) ?? 0,
    })),
  };
};

export const updateGuideProfile = async (
  userId: string,
  input: UpdateGuideProfileInput,
) => {
  const row = await prisma.guideProfile.update({
    where: { userId },
    data: input,
    include: guideCardInclude(new Date()),
  });
  return toGuideCard(row);
};
