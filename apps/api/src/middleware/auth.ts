import type { RequestHandler, Request } from "express";
import type { Role } from "@seoul/shared";
import { verifyToken, type AuthClaims } from "../lib/jwt";
import { forbidden, unauthorized } from "../lib/http-error";

const readBearer = (header: string | undefined) => {
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
};

/** Attaches req.auth when a valid token is present but never rejects. For public routes that change with the viewer. */
export const optionalAuth: RequestHandler = (req, _res, next) => {
  const token = readBearer(req.headers.authorization);
  const claims = token ? verifyToken(token) : null;
  if (claims) req.auth = claims;
  next();
};

export const requireAuth: RequestHandler = (req, _res, next) => {
  const token = readBearer(req.headers.authorization);
  const claims = token ? verifyToken(token) : null;
  if (!claims) throw unauthorized();
  req.auth = claims;
  next();
};

export const requireRole =
  (role: Role): RequestHandler =>
  (req, _res, next) => {
    if (!req.auth) throw unauthorized();
    if (req.auth.role !== role)
      throw forbidden(`Only ${role.toLowerCase()}s can do this`);
    next();
  };

/** For handlers behind requireAuth; keeps the non-null assertion in one place. */
export const getAuth = (req: Request): AuthClaims => {
  if (!req.auth) throw unauthorized();
  return req.auth;
};
