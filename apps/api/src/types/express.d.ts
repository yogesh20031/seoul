import type { AuthClaims } from "../lib/jwt";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthClaims;
    }
  }
}

export {};
