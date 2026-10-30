import { Router } from "express";
import {
  createTourSchema,
  idSchema,
  tourQuerySchema,
  updateTourSchema,
} from "@seoul/shared";
import {
  getAuth,
  optionalAuth,
  requireAuth,
  requireRole,
} from "../../middleware/auth";
import { parse } from "../../middleware/validate";
import {
  cancelTour,
  createTour,
  getTourDetail,
  listTours,
  updateTour,
} from "./service";

export const toursRouter: Router = Router();

toursRouter.get("/", async (req, res) => {
  res.json(await listTours(parse(tourQuerySchema, req.query)));
});

toursRouter.post("/", requireAuth, requireRole("GUIDE"), async (req, res) => {
  res
    .status(201)
    .json(
      await createTour(getAuth(req).userId, parse(createTourSchema, req.body)),
    );
});

toursRouter.get("/:id", optionalAuth, async (req, res) => {
  res.json(
    await getTourDetail(parse(idSchema, req.params.id), req.auth?.userId),
  );
});

toursRouter.patch(
  "/:id",
  requireAuth,
  requireRole("GUIDE"),
  async (req, res) => {
    res.json(
      await updateTour(
        getAuth(req).userId,
        parse(idSchema, req.params.id),
        parse(updateTourSchema, req.body),
      ),
    );
  },
);

toursRouter.post(
  "/:id/cancel",
  requireAuth,
  requireRole("GUIDE"),
  async (req, res) => {
    res.json(
      await cancelTour(getAuth(req).userId, parse(idSchema, req.params.id)),
    );
  },
);
