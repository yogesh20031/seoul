"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import type { Locale } from "@seoul/shared";
import { usePathname, useRouter } from "@/i18n/navigation";

/** Swaps the locale in place: same page, same query string, other language. */
export const useSwitchLocale = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    startTransition(() => {
      // Read the query at click time rather than with useSearchParams, which would opt every page out of static rendering.
      router.replace(`${pathname}${window.location.search}`, { locale: next });
    });
  };

  return { locale, pending, switchTo };
};
