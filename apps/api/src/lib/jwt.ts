import jwt from "jsonwebtoken";
import { roleSchema, type Role } from "@seoul/shared";
import { z } from "zod";
import { env } from "../config/env";

const claimsSchema = z.object({ sub: z.string(), role: roleSchema });
export type AuthClaims = { userId: string; role: Role };

const TTL = "7d";

export const signToken = ({ userId, role }: AuthClaims) =>
  jwt.sign({ role }, env.JWT_SECRET, {
    subject: userId,
    expiresIn: TTL,
    algorithm: "HS256",
  });

/** Returns null for anything invalid or expired; callers decide whether that's a 401. */
export const verifyToken = (token: string): AuthClaims | null => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    const claims = claimsSchema.safeParse(decoded);
    return claims.success
      ? { userId: claims.data.sub, role: claims.data.role }
      : null;
  } catch {
    return null;
  }
};
