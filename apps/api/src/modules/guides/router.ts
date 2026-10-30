import { Router } from "express";
import {
  guideQuerySchema,
  idSchema,
  updateGuideProfileSchema,
} from "@seoul/shared";
import { getAuth, requireAuth, requireRole } from "../../middleware/auth";
import { parse } from "../../middleware/validate";
import { getGuide, listGuides, topGuides, updateGuideProfile } from "./service";

export const guidesRouter: Router = Router();

guidesRouter.get("/", async (req, res) => {
  res.json(await listGuides(parse(guideQuerySchema, req.query)));
});

guidesRouter.get("/top", async (_req, res) => {
  res.json(await topGuides());
});

guidesRouter.put("/me", requireAuth, requireRole("GUIDE"), async (req, res) => {
  res.json(
    await updateGuideProfile(
      getAuth(req).userId,
      parse(updateGuideProfileSchema, req.body),
    ),
  );
});

guidesRouter.get("/:id", async (req, res) => {
  res.json(await getGuide(parse(idSchema, req.params.id)));
});
