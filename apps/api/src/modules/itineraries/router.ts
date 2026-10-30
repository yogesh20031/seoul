import { Router } from "express";
import { planItinerarySchema, saveItinerarySchema } from "@seoul/shared";
import { z } from "zod";
import { getAuth, requireAuth } from "../../middleware/auth";
import { parse } from "../../middleware/validate";
import {
  getSharedItinerary,
  listMyItineraries,
  planItinerary,
  saveItinerary,
} from "./service";

export const itinerariesRouter: Router = Router();

const tokenSchema = z.string().min(1).max(64);

itinerariesRouter.post("/plan", async (req, res) => {
  res.json(await planItinerary(parse(planItinerarySchema, req.body)));
});

itinerariesRouter.post("/", requireAuth, async (req, res) => {
  res
    .status(201)
    .json(
      await saveItinerary(
        getAuth(req).userId,
        parse(saveItinerarySchema, req.body),
      ),
    );
});

itinerariesRouter.get("/mine", requireAuth, async (req, res) => {
  res.json(await listMyItineraries(getAuth(req).userId));
});

itinerariesRouter.get("/:shareToken", async (req, res) => {
  res.json(await getSharedItinerary(parse(tokenSchema, req.params.shareToken)));
});
