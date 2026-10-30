import type { Prisma } from "@prisma/client";
import type { PlaceQuery } from "@seoul/shared";
import { prisma } from "../../lib/prisma";
import { HttpError, notFound } from "../../lib/http-error";
import { pageArgs, toPaginated } from "../../lib/pagination";
import { toPlace, toPlaceSummary } from "../../lib/mappers";

export const listPlaces = async (query: PlaceQuery) => {
  const where: Prisma.PlaceWhereInput = {
    ...(query.category ? { category: query.category } : {}),
    ...(query.district
      ? { district: { equals: query.district, mode: "insensitive" } }
      : {}),
    ...(query.tag ? { tags: { has: query.tag.toLowerCase() } } : {}),
    ...(query.q
      ? {
          OR: [
            { nameEn: { contains: query.q, mode: "insensitive" } },
            { nameKo: { contains: query.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const [rows, total] = await Promise.all([
    prisma.place.findMany({
      where,
      orderBy: [{ category: "asc" }, { nameEn: "asc" }],
      ...pageArgs(query),
    }),
    prisma.place.count({ where }),
  ]);
  return toPaginated(rows.map(toPlace), total, query);
};

export const getPlace = async (slug: string) => {
  const place = await prisma.place.findUnique({ where: { slug } });
  if (!place) throw notFound("Place");
  return toPlace(place);
};

export const listDistricts = async () => {
  const rows = await prisma.place.findMany({
    distinct: ["district"],
    select: { district: true },
    orderBy: { district: "asc" },
  });
  return rows.map((r) => r.district);
};

/** Returns places in the order of `ids`, dropping duplicates; 400s if any id is unknown. */
export const loadPlacesInOrder = async (ids: string[]) => {
  const unique = [...new Set(ids)];
  const rows = await prisma.place.findMany({ where: { id: { in: unique } } });
  if (rows.length !== unique.length)
    throw new HttpError(
      400,
      "PLACES_NOT_FOUND",
      "One or more places do not exist",
    );
  const byId = new Map(rows.map((p) => [p.id, p]));
  return unique.flatMap((id) => {
    const place = byId.get(id);
    return place ? [place] : [];
  });
};

const dishInclude = {
  whereToEat: { orderBy: { nameEn: "asc" } },
} satisfies Prisma.DishInclude;

type DishRow = Prisma.DishGetPayload<{ include: typeof dishInclude }>;

const toDish = (dish: DishRow) => ({
  id: dish.id,
  slug: dish.slug,
  nameEn: dish.nameEn,
  nameKo: dish.nameKo,
  descriptionEn: dish.descriptionEn,
  descriptionKo: dish.descriptionKo,
  imageUrl: dish.imageUrl,
  imageCredit: dish.imageCredit,
  spiceLevel: dish.spiceLevel,
  priceFrom: dish.priceFrom,
  whereToEat: dish.whereToEat.map(toPlaceSummary),
});

export const listDishes = async () => {
  const rows = await prisma.dish.findMany({
    include: dishInclude,
    orderBy: { nameEn: "asc" },
  });
  return rows.map(toDish);
};

export const getDish = async (slug: string) => {
  const dish = await prisma.dish.findUnique({
    where: { slug },
    include: dishInclude,
  });
  if (!dish) throw notFound("Dish");
  return toDish(dish);
};

export const listTransport = () =>
  prisma.transportGuide.findMany({
    orderBy: { order: "asc" },
    omit: { order: true },
  });

export const getTransport = async (slug: string) => {
  const guide = await prisma.transportGuide.findUnique({
    where: { slug },
    omit: { order: true },
  });
  if (!guide) throw notFound("Transport guide");
  return guide;
};
