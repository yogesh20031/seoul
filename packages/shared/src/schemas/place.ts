import { z } from "zod";
import { pageQuerySchema } from "./common";

export const PLACE_CATEGORIES = ["ATTRACTION", "RESTAURANT", "HOTEL"] as const;
export const placeCategorySchema = z.enum(PLACE_CATEGORIES);
export type PlaceCategory = z.infer<typeof placeCategorySchema>;

export const placeQuerySchema = pageQuerySchema.extend({
  category: placeCategorySchema.optional(),
  district: z.string().trim().max(40).optional(),
  tag: z.string().trim().max(40).optional(),
  q: z.string().trim().max(80).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
});
export type PlaceQuery = z.infer<typeof placeQuerySchema>;

export type Place = {
  id: string;
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
  imageUrl: string;
  /** "Author / License" for the photo; Creative Commons licences require showing it. */
  imageCredit: string | null;
  tags: string[];
  /** 1 (cheap) to 4 (splurge). Null for free attractions. */
  priceLevel: number | null;
  openHours: string | null;
  suggestedMinutes: number;
  nearestStation: string | null;
  bookingUrl: string | null;
  /** What to see or do (for restaurants, what to order). Parallel lists: highlightsEn[i] is highlightsKo[i]. */
  highlightsEn: string[];
  highlightsKo: string[];
  /** Practical advice: closed days, best exit, queues, dress code. */
  tipsEn: string[];
  tipsKo: string[];
  admissionEn: string | null;
  admissionKo: string | null;
  bestTimeEn: string | null;
  bestTimeKo: string | null;
};

export type PlaceSummary = Pick<
  Place,
  | "id"
  | "slug"
  | "category"
  | "nameEn"
  | "nameKo"
  | "district"
  | "lat"
  | "lng"
  | "imageUrl"
  | "suggestedMinutes"
>;

export type Dish = {
  id: string;
  slug: string;
  nameEn: string;
  nameKo: string;
  descriptionEn: string;
  descriptionKo: string;
  imageUrl: string;
  imageCredit: string | null;
  /** 0 (mild) to 3 (very spicy). */
  spiceLevel: number;
  /** Typical price in KRW. */
  priceFrom: number;
  whereToEat: PlaceSummary[];
};

export const TRANSPORT_KINDS = [
  "SUBWAY",
  "BUS",
  "TAXI",
  "AIRPORT",
  "TMONEY",
  "APP",
] as const;
export type TransportKind = (typeof TRANSPORT_KINDS)[number];

export type TransportGuide = {
  id: string;
  slug: string;
  kind: TransportKind;
  titleEn: string;
  titleKo: string;
  summaryEn: string;
  summaryKo: string;
  /** Markdown. */
  bodyEn: string;
  bodyKo: string;
};
