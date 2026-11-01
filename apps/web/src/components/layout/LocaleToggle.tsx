"use client";

import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSwitchLocale } from "@/hooks/useSwitchLocale";
import { cn } from "@/lib/cn";

export const LocaleToggle = ({ className }: { className?: string }) => {
  const t = useTranslations("Toggle");
  const { locale, pending, switchTo } = useSwitchLocale();
  const next = locale === "en" ? "ko" : "en";

  return (
    <button
      type="button"
      onClick={() => switchTo(next)}
      disabled={pending}
      aria-label={`${t("language")}: ${next === "ko" ? t("korean") : t("english")}`}
      className={cn(
        "flex h-10 items-center gap-1.5 rounded-full px-2.5 text-2sm font-medium text-text-secondary transition-colors hover:bg-card-hover disabled:opacity-60 sm:px-3",
        className,
      )}
    >
      <Languages className="size-4" />
      {/* Phones get the short code so the header still fits the logo, theme and menu buttons. */}
      <span className="sm:hidden">{next === "ko" ? "KO" : "EN"}</span>
      <span className="hidden sm:inline">
        {next === "ko" ? "한국어" : "EN"}
      </span>
    </button>
  );
};
