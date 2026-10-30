import { defineRouting } from "next-intl/routing";
import { LOCALES } from "@seoul/shared";

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: "en",
  localeCookie: { name: "SM_LOCALE", maxAge: 60 * 60 * 24 * 365 },
});
