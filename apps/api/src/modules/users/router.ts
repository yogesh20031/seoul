import { Router } from "express";
import { idSchema, updateMeSchema } from "@seoul/shared";
import { getAuth, requireAuth } from "../../middleware/auth";
import { parse } from "../../middleware/validate";
import { getPublicUser, updateMe } from "./service";

export const usersRouter: Router = Router();

usersRouter.patch("/me", requireAuth, async (req, res) => {
  res.json(
    await updateMe(getAuth(req).userId, parse(updateMeSchema, req.body)),
  );
});

usersRouter.get("/:id", async (req, res) => {
  res.json(await getPublicUser(parse(idSchema, req.params.id)));
});
