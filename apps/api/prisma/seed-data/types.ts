import type { PlaceCategory } from "@prisma/client";

export type PlaceSeed = {
  slug: string;
  category: PlaceCategory;
  nameEn: string;
  nameKo: string;
  descriptionEn: string;
  descriptionKo: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  tags: string[];
  priceLevel: number | null;
  openHours: string | null;
  suggestedMinutes: number;
  nearestStation: string | null;
  bookingUrl: string | null;
};

type PlaceFields = Omit<
  PlaceSeed,
  "category" | "priceLevel" | "openHours" | "bookingUrl"
> &
  Partial<Pick<PlaceSeed, "priceLevel" | "openHours" | "bookingUrl">>;

const withDefaults = (
  category: PlaceCategory,
  fields: PlaceFields,
): PlaceSeed => ({
  priceLevel: null,
  openHours: null,
  bookingUrl: null,
  ...fields,
  category,
});

export const attraction = (fields: PlaceFields) =>
  withDefaults("ATTRACTION", fields);
export const restaurant = (fields: PlaceFields) =>
  withDefaults("RESTAURANT", fields);
export const hotel = (fields: PlaceFields) => withDefaults("HOTEL", fields);
