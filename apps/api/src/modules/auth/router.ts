import { Router } from "express";
import { loginSchema, registerSchema } from "@seoul/shared";
import { getAuth, requireAuth } from "../../middleware/auth";
import { parse } from "../../middleware/validate";
import { getMe, login, register } from "./service";

export const authRouter: Router = Router();

authRouter.post("/register", async (req, res) => {
  res.status(201).json(await register(parse(registerSchema, req.body)));
});

authRouter.post("/login", async (req, res) => {
  res.json(await login(parse(loginSchema, req.body)));
});

authRouter.get("/me", requireAuth, async (req, res) => {
  res.json(await getMe(getAuth(req).userId));
});
