import "server-only";
import { redirect } from "next/navigation";
import type { Locale, Role } from "@seoul/shared";
import { getCurrentUser } from "./session";

/**
 * Page-level gate. proxy.ts only checks that a cookie exists; this checks the token is still
 * valid and the role matches. The API enforces the same rules again on every request.
 */
export const requireRole = async (role: Role, locale: Locale, path: string) => {
  const user = await getCurrentUser();
  if (!user)
    redirect(
      `/${locale}/login?next=${encodeURIComponent(`/${locale}${path}`)}`,
    );
  if (user.role !== role) redirect(`/${locale}/forbidden?role=${role}`);
  return user;
};

/** For Server Actions: the signed-in user if they have the role, otherwise null. */
export const userWithRole = async (role: Role) => {
  const user = await getCurrentUser();
  return user?.role === role ? user : null;
};
