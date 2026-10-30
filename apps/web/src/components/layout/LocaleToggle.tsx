"use client";

import { useTransition } from "react";
import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export const LocaleToggle = ({ className }: { className?: string }) => {
  const t = useTranslations("Toggle");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next = locale === "en" ? "ko" : "en";

  const switchLocale = () => {
    startTransition(() => {
      // Read the query at click time rather than with useSearchParams, which would opt every page out of static rendering.
      router.replace(`${pathname}${window.location.search}`, { locale: next });
    });
  };

  return (
    <button
      type="button"
      onClick={switchLocale}
      disabled={pending}
      aria-label={`${t("language")}: ${next === "ko" ? t("korean") : t("english")}`}
      className={cn(
        "flex h-10 items-center gap-1.5 rounded-full px-3 text-2sm font-medium text-text-secondary transition-colors hover:bg-card-hover disabled:opacity-60",
        className,
      )}
    >
      <Languages className="size-4" />
      <span>{next === "ko" ? "한국어" : "EN"}</span>
    </button>
  );
};
