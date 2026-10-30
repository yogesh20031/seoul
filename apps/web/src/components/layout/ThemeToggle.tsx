"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export const ThemeToggle = () => {
  const t = useTranslations("Toggle");
  const { resolvedTheme, setTheme } = useTheme();

  // Both icons render and CSS picks one, so there's no flash or hydration mismatch before the theme is known.
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t("theme")}
      title={t("theme")}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
};
