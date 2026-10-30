import type messages from "../messages/en.json";
import type { routing } from "@/i18n/routing";

// Typed translation keys: a missing or misspelt key fails `tsc` instead of rendering the raw key.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
