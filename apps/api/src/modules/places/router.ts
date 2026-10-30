import { Router } from "express";
import { placeQuerySchema } from "@seoul/shared";
import { z } from "zod";
import { parse } from "../../middleware/validate";
import {
  getDish,
  getPlace,
  getTransport,
  listDishes,
  listDistricts,
  listPlaces,
  listTransport,
} from "./service";

export const placesRouter: Router = Router();

const slugSchema = z.string().min(1).max(100);

placesRouter.get("/places", async (req, res) => {
  res.json(await listPlaces(parse(placeQuerySchema, req.query)));
});

placesRouter.get("/places/:slug", async (req, res) => {
  res.json(await getPlace(parse(slugSchema, req.params.slug)));
});

placesRouter.get("/districts", async (_req, res) => {
  res.json(await listDistricts());
});

placesRouter.get("/dishes", async (_req, res) => {
  res.json(await listDishes());
});

placesRouter.get("/dishes/:slug", async (req, res) => {
  res.json(await getDish(parse(slugSchema, req.params.slug)));
});

placesRouter.get("/transport", async (_req, res) => {
  res.json(await listTransport());
});

placesRouter.get("/transport/:slug", async (req, res) => {
  res.json(await getTransport(parse(slugSchema, req.params.slug)));
});
