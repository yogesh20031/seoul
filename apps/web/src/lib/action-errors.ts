import "server-only";
import { getLocale, getTranslations } from "next-intl/server";
import { ApiError } from "./api";
import type { FormState } from "./form";

// Codes with their own message under Errors.api in the message files.
const TRANSLATED_CODES = [
  "RATE_LIMITED",
  "API_UNREACHABLE",
  "PLACES_NOT_FOUND",
  "EMAIL_TAKEN",
  "INVALID_CREDENTIALS",
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
] as const;

type TranslatedCode = (typeof TRANSLATED_CODES)[number];

const isTranslatedCode = (code: string): code is TranslatedCode =>
  TRANSLATED_CODES.some((known) => known === code);

/**
 * The API's messages are English. Known codes get a translated message; otherwise English visitors
 * see the API's own (specific) message and everyone else a generic one in their language.
 */
export const apiErrorMessage = async (error: ApiError) => {
  const [t, locale] = await Promise.all([
    getTranslations("Errors.api"),
    getLocale(),
  ]);
  if (isTranslatedCode(error.code)) return t(error.code);
  return locale === "en" ? error.message : t("generic");
};

/** Turns an API rejection into form feedback; anything else is a real bug and should reach the error boundary. */
export const apiFailure = async (error: unknown): Promise<FormState> => {
  if (error instanceof ApiError)
    return { status: "error", message: await apiErrorMessage(error) };
  throw error;
};
