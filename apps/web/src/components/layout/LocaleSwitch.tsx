"use client";

import { useTranslations } from "next-intl";
import type { Locale } from "@seoul/shared";
import { useSwitchLocale } from "@/hooks/useSwitchLocale";

const OPTIONS = [
  { value: "en", labelKey: "english" },
  { value: "ko", labelKey: "korean" },
] as const satisfies readonly { value: Locale; labelKey: string }[];

// Both languages side by side for the mobile menu, where a single "switch" button is easy to miss.
export const LocaleSwitch = () => {
  const t = useTranslations("Toggle");
  const { locale, pending, switchTo } = useSwitchLocale();

  return (
    <div
      role="radiogroup"
      aria-label={t("language")}
      className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1"
    >
      {OPTIONS.map(({ value, labelKey }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={locale === value}
          disabled={pending}
          onClick={() => switchTo(value)}
          className="rounded-full px-4 py-2 text-sm font-medium text-text-secondary transition-colors disabled:opacity-60 aria-checked:bg-card aria-checked:text-foreground aria-checked:shadow-sm"
        >
          {t(labelKey)}
        </button>
      ))}
    </div>
  );
};
