import "server-only";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@seoul/shared";
import { routing } from "@/i18n/routing";

/**
 * Every page and layout calls this first: it 404s unknown locales, narrows the type, and
 * tells next-intl the locale so pages can still be statically rendered.
 */
export const enterLocale = async (
  params: Promise<{ locale: string }>,
): Promise<Locale> => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return locale;
};
