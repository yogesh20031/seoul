import { z } from "zod";
import { idSchema } from "./common";

export const createReviewSchema = z
  .object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().trim().max(1000).default(""),
    bookingId: idSchema.optional(),
    soloRequestId: idSchema.optional(),
  })
  .refine((v) => Boolean(v.bookingId) !== Boolean(v.soloRequestId), {
    message: "Review exactly one booking or solo trip",
  });
export type CreateReviewInput = z.infer<typeof createReviewSchema>;

/** Highest first, the order the breakdown and the star picker labels are shown in. */
export const RATING_STARS = [5, 4, 3, 2, 1] as const;

export type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
    country: string | null;
  };
};

/** A new review plus the guide's score after it was counted, so the UI can show the effect. */
export type CreatedReview = Review & {
  guideRating: { ratingAvg: number; ratingCount: number };
};
