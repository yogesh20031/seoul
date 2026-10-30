"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useDismiss } from "@/hooks/useDismiss";
import { cn } from "@/lib/cn";
import { EXPLORE_ITEMS } from "./nav-items";

export const ExploreMenu = () => {
  const t = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1 rounded-full px-3.5 py-2 text-2sm font-medium text-text-secondary transition-colors hover:bg-card-hover"
      >
        {t("explore")}
        <ChevronDown
          className={cn(
            "size-4 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div
          data-slot="popover-content"
          className="absolute top-full left-0 mt-2 w-[22rem] animate-in glassy-strong p-2 shadow-xl duration-200 fade-in slide-in-from-top-1"
        >
          {EXPLORE_ITEMS.map(({ href, label, hint, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-card-hover"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-primary-900">
                <Icon className="size-4.5" />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-medium">{t(label)}</span>
                <span className="text-xs text-muted-foreground">{t(hint)}</span>
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
};
