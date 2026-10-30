import type { Locale } from "@seoul/shared";

const SEOUL_TZ = "Asia/Seoul";

export const formatKrw = (amount: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-US", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);

// Tours happen in Seoul, so show Seoul time whatever the visitor's own timezone is.
export const formatDateTime = (iso: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-GB", {
    timeZone: SEOUL_TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

export const formatDate = (isoOrDate: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-GB", {
    timeZone: SEOUL_TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(
    new Date(
      isoOrDate.length === 10 ? `${isoOrDate}T00:00:00+09:00` : isoOrDate,
    ),
  );

export const formatDuration = (minutes: number, locale: Locale) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (locale === "ko")
    return [h ? `${h}시간` : "", m ? `${m}분` : ""].filter(Boolean).join(" ");
  return [h ? `${h}h` : "", m ? `${m}m` : ""].filter(Boolean).join(" ");
};

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

/** Picks the field for the active language from our bilingual `xxxEn` / `xxxKo` columns. */
export const pick = <
  T extends Record<`${K}En` | `${K}Ko`, string>,
  K extends string,
>(
  item: T,
  key: K,
  locale: Locale,
): string => (locale === "ko" ? item[`${key}Ko`] : item[`${key}En`]);

/** Today's date in Seoul as YYYY-MM-DD, for date-input minimums. en-CA happens to format as ISO. */
export const seoulToday = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: SEOUL_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

/** Splits an ISO instant into Seoul-local YYYY-MM-DD and HH:mm, for prefilling date and time inputs. */
export const seoulDateParts = (iso: string) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SEOUL_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
};
