import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import type { AuthUser } from "@seoul/shared";

export const SESSION_COOKIE = "sm_token";
const WEEK_SECONDS = 60 * 60 * 24 * 7;

export const getToken = async () =>
  (await cookies()).get(SESSION_COOKIE)?.value ?? null;

export const setSession = async (token: string) => {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Matches the API's JWT lifetime so the cookie never outlives the token.
    maxAge: WEEK_SECONDS,
  });
};

export const clearSession = async () => {
  (await cookies()).delete(SESSION_COOKIE);
};

/** The logged-in user, or null. Cached per request so layouts and pages can both call it. */
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  if (!(await getToken())) return null;
  // Imported lazily to avoid a cycle: api.ts reads the token from this module.
  const { api, ApiError } = await import("./api");
  try {
    return await api<AuthUser>("/auth/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
});
