import { z } from "zod";
import { pageQuerySchema } from "./common";
import type { TourCard } from "./tour";
import type { Review } from "./review";

export const GUIDE_SORTS = [
  "rating",
  "price_asc",
  "price_desc",
  "newest",
] as const;

export const guideQuerySchema = pageQuerySchema.extend({
  q: z.string().trim().max(80).optional(),
  language: z.string().trim().max(30).optional(),
  specialty: z.string().trim().max(40).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  sort: z.enum(GUIDE_SORTS).default("rating"),
});
export type GuideQuery = z.infer<typeof guideQuerySchema>;

export const updateGuideProfileSchema = z.object({
  headline: z.string().trim().min(5).max(120),
  languages: z.array(z.string().trim().min(2).max(30)).min(1).max(8),
  specialties: z.array(z.string().trim().min(2).max(40)).max(10),
  // KRW; Stripe treats KRW as zero-decimal so this is also the Stripe amount
  soloPrice: z.number().int().min(10_000).max(2_000_000),
  soloDurationMin: z.number().int().min(60).max(720),
});
export type UpdateGuideProfileInput = z.infer<typeof updateGuideProfileSchema>;

export type GuideCard = {
  id: string;
  name: string;
  avatarUrl: string | null;
  headline: string;
  languages: string[];
  specialties: string[];
  soloPrice: number;
  soloDurationMin: number;
  ratingAvg: number;
  ratingCount: number;
  isVerified: boolean;
  nextTourAt: string | null;
};

export type GuideDetail = GuideCard & {
  bio: string | null;
  country: string | null;
  memberSince: string;
  toursLed: number;
  upcomingTours: TourCard[];
  reviews: Review[];
  /** How many reviews gave each star rating, 5 stars first. */
  ratingBreakdown: { stars: number; count: number }[];
};
