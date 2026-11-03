import { Router } from "express";
import {
  acceptSoloRequestSchema,
  createSoloRequestSchema,
  idSchema,
  soloPaySchema,
} from "@seoul/shared";
import { getAuth, requireAuth, requireRole } from "../../middleware/auth";
import { parse } from "../../middleware/validate";
import {
  acceptSoloRequest,
  cancelSoloRequest,
  createSoloRequest,
  declineSoloRequest,
  listMySoloRequests,
  paySoloRequest,
} from "./service";

export const soloRouter: Router = Router();

soloRouter.post(
  "/guides/:id/solo-requests",
  requireAuth,
  requireRole("TRAVELLER"),
  async (req, res) => {
    const created = await createSoloRequest(
      getAuth(req).userId,
      parse(idSchema, req.params.id),
      parse(createSoloRequestSchema, req.body),
    );
    res.status(201).json(created);
  },
);

soloRouter.get("/me/solo-requests", requireAuth, async (req, res) => {
  const { userId, role } = getAuth(req);
  res.json(await listMySoloRequests(userId, role));
});

soloRouter.post(
  "/solo-requests/:id/accept",
  requireAuth,
  requireRole("GUIDE"),
  async (req, res) => {
    res.json(
      await acceptSoloRequest(
        getAuth(req).userId,
        parse(idSchema, req.params.id),
        parse(acceptSoloRequestSchema, req.body),
      ),
    );
  },
);

soloRouter.post(
  "/solo-requests/:id/decline",
  requireAuth,
  requireRole("GUIDE"),
  async (req, res) => {
    res.json(
      await declineSoloRequest(
        getAuth(req).userId,
        parse(idSchema, req.params.id),
      ),
    );
  },
);

soloRouter.post(
  "/solo-requests/:id/cancel",
  requireAuth,
  requireRole("TRAVELLER"),
  async (req, res) => {
    res.json(
      await cancelSoloRequest(
        getAuth(req).userId,
        parse(idSchema, req.params.id),
      ),
    );
  },
);

soloRouter.post(
  "/solo-requests/:id/pay",
  requireAuth,
  requireRole("TRAVELLER"),
  async (req, res) => {
    res.json(
      await paySoloRequest(
        getAuth(req).userId,
        parse(idSchema, req.params.id),
        parse(soloPaySchema, req.body ?? {}),
      ),
    );
  },
);
