import { z } from "zod";
import { localeSchema } from "./common";

export const ROLES = ["TRAVELLER", "GUIDE"] as const;
export const roleSchema = z.enum(ROLES);
export type Role = z.infer<typeof roleSchema>;

export const registerSchema = z.object({
  email: z.email().trim().toLowerCase(),
  // bcrypt silently truncates past 72 bytes, so cap it rather than pretend longer passwords count
  password: z.string().min(8).max(72),
  name: z.string().trim().min(2).max(60),
  role: roleSchema,
  locale: localeSchema.default("en"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1).max(72),
});
export type LoginInput = z.infer<typeof loginSchema>;

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl: string | null;
  locale: "en" | "ko";
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};
