"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO } from "../motion";

// Native names, because that's how a visitor scans for their own language.
const LANGUAGES = [
  { id: "English", label: "English" },
  { id: "Japanese", label: "日本語" },
  { id: "Chinese", label: "中文" },
  { id: "Spanish", label: "Español" },
] as const;

type LanguageId = (typeof LANGUAGES)[number]["id"];

const GUIDES: {
  id: string;
  name: string;
  rating: number;
  languages: LanguageId[];
  avatar: string;
}[] = [
  {
    id: "minji",
    name: "Minji",
    rating: 4.9,
    languages: ["English", "Japanese"],
    avatar: "https://i.pravatar.cc/96?u=seoulmate-demo-minji",
  },
  {
    id: "carlos",
    name: "Carlos",
    rating: 4.8,
    languages: ["Spanish", "English"],
    avatar: "https://i.pravatar.cc/96?u=seoulmate-demo-carlos",
  },
  {
    id: "wei",
    name: "Wei",
    rating: 4.7,
    languages: ["Chinese", "English"],
    avatar: "https://i.pravatar.cc/96?u=seoulmate-demo-wei",
  },
  {
    id: "yuki",
    name: "Yuki",
    rating: 4.8,
    languages: ["Japanese"],
    avatar: "https://i.pravatar.cc/96?u=seoulmate-demo-yuki",
  },
  {
    id: "jisoo",
    name: "Jisoo",
    rating: 4.6,
    languages: ["English", "Chinese"],
    avatar: "https://i.pravatar.cc/96?u=seoulmate-demo-jisoo",
  },
];

const CYCLE_MS = 2600;

export const GuideMatcherDemo = () => {
  const t = useTranslations("Playground");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [language, setLanguage] = useState<LanguageId>("English");
  const [touched, setTouched] = useState(false);

  // Cycles through languages on its own until the visitor picks one.
  useEffect(() => {
    if (!inView || reduce || touched) return;
    const id = window.setTimeout(() => {
      const index = LANGUAGES.findIndex((l) => l.id === language);
      setLanguage(LANGUAGES[(index + 1) % LANGUAGES.length]!.id);
    }, CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [inView, reduce, touched, language]);

  const matches = GUIDES.filter((guide) =>
    guide.languages.includes(language),
  ).sort((a, b) => b.rating - a.rating);

  return (
    <div ref={ref} className="flex flex-1 flex-col gap-4">
      <div
        className="flex flex-wrap gap-1.5"
        role="radiogroup"
        aria-label={t("matcherHint")}
      >
        {LANGUAGES.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={language === option.id}
            onClick={() => {
              setTouched(true);
              setLanguage(option.id);
            }}
            className={cn(
              "relative h-8 cursor-pointer rounded-full px-3.5 text-xs font-medium transition-colors",
              language === option.id
                ? "text-white"
                : "glassy-full text-foreground hover:text-primary",
            )}
          >
            {language === option.id ? (
              // Shared layoutId slides the highlight between chips instead of blinking.
              <motion.span
                layoutId="matcher-active"
                className="absolute inset-0 -z-10 rounded-full bg-primary"
                transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              />
            ) : null}
            {option.label}
          </button>
        ))}
      </div>

      <ul className="relative flex min-h-48 flex-col gap-2" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          {matches.map((guide) => (
            <motion.li
              key={guide.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="flex items-center gap-3 rounded-2xl bg-card/70 p-2.5 ring-1 ring-border/60"
            >
              <Avatar name={guide.name} src={guide.avatar} size={32} />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-semibold">{guide.name}</span>
                <span className="truncate text-2xs text-muted-foreground">
                  {guide.languages.join(" · ")}
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {guide.rating.toFixed(1)}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
        {matches.length === 0 ? (
          <li className="text-xs text-muted-foreground">{t("matcherEmpty")}</li>
        ) : null}
      </ul>
    </div>
  );
};
