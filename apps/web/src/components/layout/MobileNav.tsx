"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { buttonVariants } from "@/components/ui/button-variants";
import { LocaleSwitch } from "./LocaleSwitch";
import { EXPLORE_ITEMS, MAIN_ITEMS } from "./nav-items";

export const MobileNav = ({ loggedIn }: { loggedIn: boolean }) => {
  const t = useTranslations("Nav");
  const tToggle = useTranslations("Toggle");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Lock page scroll behind the sheet; <body> is outside React's tree, so this is a real side effect.
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("menu")}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu />
      </Button>
      {open ? (
        <div
          data-slot="sheet-content"
          className="fixed inset-0 z-[60] flex animate-in flex-col duration-200 fade-in"
        >
          <div className="flex h-16 items-center justify-end px-4">
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("close")}
              onClick={() => setOpen(false)}
            >
              <X />
            </Button>
          </div>
          <nav className="flex flex-col gap-1 overflow-y-auto px-6 pb-10">
            {[...EXPLORE_ITEMS, ...MAIN_ITEMS].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={pathname === href ? "page" : undefined}
                className="rounded-xl px-3 py-3 text-lg font-medium transition-colors hover:bg-card-hover aria-[current=page]:text-primary"
              >
                {t(label)}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-2 px-3">
              <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                {tToggle("language")}
              </span>
              <LocaleSwitch />
            </div>
            {loggedIn ? null : (
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({ size: "lg" })}
                >
                  {t("signup")}
                </Link>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={buttonVariants({
                    variant: "secondary",
                    size: "lg",
                  })}
                >
                  {t("login")}
                </Link>
              </div>
            )}
          </nav>
        </div>
      ) : null}
    </div>
  );
};
