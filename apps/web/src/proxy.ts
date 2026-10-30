import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intl = createMiddleware(routing);

// Only a cheap "is there a session cookie" check lives here; the page and the API do the real
// role check, so a forged cookie gets nothing more than a redirect to the login page.
const PROTECTED = /^\/(en|ko)\/(dashboard|guide)(\/|$)/;

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (PROTECTED.test(pathname) && !request.cookies.has("sm_token")) {
    const locale = pathname.split("/")[1] ?? routing.defaultLocale;
    const login = new URL(`/${locale}/login`, request.url);
    login.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }
  return intl(request);
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
