import { Router } from "express";
import { createReviewSchema, idSchema } from "@seoul/shared";
import { getAuth, requireAuth, requireRole } from "../../middleware/auth";
import { parse } from "../../middleware/validate";
import { createReview, listReviews } from "./service";

export const reviewsRouter: Router = Router();

reviewsRouter.get("/guides/:id/reviews", async (req, res) => {
  res.json(await listReviews(parse(idSchema, req.params.id)));
});

reviewsRouter.post(
  "/guides/:id/reviews",
  requireAuth,
  requireRole("TRAVELLER"),
  async (req, res) => {
    const review = await createReview(
      getAuth(req).userId,
      parse(idSchema, req.params.id),
      parse(createReviewSchema, req.body),
    );
    res.status(201).json(review);
  },
);
