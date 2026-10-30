"use client";

import { useEffect, useRef, useState } from "react";
import { Check, LayoutDashboard, Route, UsersRound } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

const FEATURES = [
  { key: "group", icon: UsersRound },
  { key: "planner", icon: Route },
  { key: "guides", icon: LayoutDashboard },
] as const;

const COUNT = FEATURES.length;
/** How long a card stays in front before the next one lands on it. */
const HOLD_MS = 6000;
const PEEK = 14;
const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

// Cards further back step down, shrink and fade so the deck reads as a stack.
const depth = (position: number) => ({
  y: position * PEEK,
  scale: 1 - position * 0.04,
  opacity: 1 - position * 0.18,
  filter: "blur(0px)",
});
const ARRIVE = { y: -28, scale: 1.04, opacity: 0, filter: "blur(4px)" };
const DEPART = { y: COUNT * PEEK, scale: 0.85, opacity: 0 };
const Z_INDEX = ["z-30", "z-20", "z-10"] as const;

type Slot = { feature: number; key: number };

const INITIAL: Slot[] = FEATURES.map((_, feature) => ({
  feature,
  key: feature,
}));

/** Three promises as a deck: the next card lands on top and the rest step back. */
export const FeatureDeck = () => {
  const t = useTranslations("Landing.features");
  const reduce = useReducedMotion() ?? false;
  const [slots, setSlots] = useState(INITIAL);
  const [paused, setPaused] = useState(false);
  const nextKey = useRef(COUNT);
  const front = slots[0]?.feature ?? 0;

  const show = (feature: number) =>
    setSlots((current) =>
      current[0]?.feature === feature
        ? current
        : [
            { feature, key: nextKey.current++ },
            ...current.filter((slot) => slot.feature !== feature),
          ],
    );

  // Auto-advance is a timer against the clock, a genuine side effect.
  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setTimeout(() => {
      setSlots((current) => {
        const nextFeature = ((current[0]?.feature ?? 0) + 1) % COUNT;
        return [
          { feature: nextFeature, key: nextKey.current++ },
          ...current.filter((s) => s.feature !== nextFeature),
        ];
      });
    }, HOLD_MS);
    return () => window.clearTimeout(id);
  }, [front, paused, reduce]);

  return (
    <div
      className="flex flex-col items-center gap-6"
      aria-roledescription="carousel"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative h-[24rem] w-full max-w-[34rem]">
        <AnimatePresence initial={false}>
          {slots.map(({ feature, key }, position) => {
            const { key: featureKey, icon: Icon } =
              FEATURES[feature] ?? FEATURES[0];
            return (
              <motion.div
                key={key}
                role="group"
                aria-roledescription="slide"
                aria-hidden={position !== 0}
                initial={reduce ? false : ARRIVE}
                animate={depth(position)}
                exit={reduce ? { opacity: 0 } : DEPART}
                transition={{ duration: reduce ? 0.2 : 0.7, ease: EXPO_OUT }}
                className={cn(
                  "feature-glow absolute inset-x-0 top-0 bottom-7 flex origin-bottom flex-col gap-5 overflow-hidden rounded-[1.75rem] border border-foreground/[0.06] bg-card p-8 shadow-xl md:p-10",
                  Z_INDEX[position],
                )}
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-primary-900">
                  <Icon className="size-6" />
                </span>
                <h3 className="text-2xl leading-snug font-semibold tracking-tight text-balance">
                  {t(`${featureKey}.title`)}
                </h3>
                <p className="text-sm text-text-secondary md:text-base">
                  {t(`${featureKey}.body`)}
                </p>
                <ul
                  className={cn(
                    "mt-auto flex flex-col gap-2.5 transition-opacity duration-300",
                    position !== 0 && "opacity-0",
                  )}
                >
                  {(["point1", "point2", "point3"] as const).map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2.5 text-sm font-medium"
                    >
                      <span className="flex size-5 items-center justify-center rounded-full bg-success/15 text-success">
                        <Check className="size-3" />
                      </span>
                      {t(`${featureKey}.${point}`)}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-1.5">
        {FEATURES.map(({ key }, feature) => (
          <button
            key={key}
            type="button"
            onClick={() => show(feature)}
            aria-label={t(`${key}.title`)}
            aria-current={feature === front}
            className={cn(
              "relative h-1.5 overflow-hidden rounded-full bg-foreground/15 transition-[width,background-color] duration-300 hover:bg-foreground/25",
              feature === front ? "w-7" : "w-1.5",
            )}
          >
            {feature === front ? (
              <motion.span
                key={`${slots[0]?.key}-${paused}`}
                className="absolute inset-0 origin-left rounded-full bg-primary"
                initial={reduce || paused ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: HOLD_MS / 1000, ease: "linear" }}
              />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
};
