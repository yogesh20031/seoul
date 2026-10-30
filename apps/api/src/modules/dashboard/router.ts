import { Router } from "express";
import { getAuth, requireAuth, requireRole } from "../../middleware/auth";
import { getOverview } from "./service";

export const dashboardRouter: Router = Router();

dashboardRouter.get(
  "/overview",
  requireAuth,
  requireRole("GUIDE"),
  async (req, res) => {
    res.json(await getOverview(getAuth(req).userId));
  },
);
