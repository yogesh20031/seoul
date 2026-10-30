"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { RotateCcw, Route } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO } from "../motion";
import {
  bestOrder,
  DEMO_PLACES,
  project,
  VIEW_H,
  VIEW_W,
  type DemoPlace,
} from "./planner-demo-data";

const MAX_STOPS = 4;
// What the card shows before anyone touches it, so it demonstrates itself on first view.
const STARTER = ["namsan", "gyeongbokgung", "gwangjang", "bukchon"];
const AUTO_PLAN_DELAY_MS = 900;

// A stylised Han river and Cheonggyecheon so the dots read as a map without loading tiles.
const RIVER = "M -5 74 C 20 66, 40 82, 60 72 S 90 64, 105 70";
const STREAM = "M 20 41 C 40 39, 60 42, 98 38";

export const PlannerDemo = () => {
  const t = useTranslations("Playground");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [selected, setSelected] = useState<string[]>(STARTER);
  const [plan, setPlan] = useState<ReturnType<typeof bestOrder> | null>(null);
  const [touched, setTouched] = useState(false);

  const chosen = DEMO_PLACES.filter((place) => selected.includes(place.id));

  // Plays the demo once when it scrolls into view, unless the visitor got there first.
  useEffect(() => {
    if (!inView || touched) return;
    const id = window.setTimeout(
      () =>
        setPlan(bestOrder(DEMO_PLACES.filter((p) => STARTER.includes(p.id)))),
      AUTO_PLAN_DELAY_MS,
    );
    return () => window.clearTimeout(id);
  }, [inView, touched]);

  const toggle = (id: string) => {
    setTouched(true);
    setPlan(null);
    setSelected((current) =>
      current.includes(id)
        ? current.filter((s) => s !== id)
        : current.length < MAX_STOPS
          ? [...current, id]
          : current,
    );
  };

  const reset = () => {
    setTouched(true);
    setPlan(null);
    setSelected([]);
  };

  const position = (id: string) =>
    plan ? plan.order.findIndex((p) => p.id === id) : -1;
  const route = plan?.order.map(project) ?? [];
  const label = (place: DemoPlace) => (locale === "ko" ? place.ko : place.en);

  return (
    <div ref={ref} className="flex flex-1 flex-col gap-4">
      <div className="relative overflow-hidden rounded-2xl bg-card/60 ring-1 ring-border/60">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="block h-auto w-full"
          role="group"
          aria-label={t("plannerHint")}
        >
          <path
            d={RIVER}
            fill="none"
            className="stroke-kr-blue/25"
            strokeWidth={6}
            strokeLinecap="round"
          />
          <path
            d={STREAM}
            fill="none"
            className="stroke-kr-blue/20"
            strokeWidth={1.2}
            strokeLinecap="round"
          />
          {route.length > 1 ? (
            <motion.path
              key={plan?.order.map((p) => p.id).join()}
              d={`M ${route.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
              fill="none"
              className="stroke-primary"
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: reduce ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: EASE_OUT_EXPO }}
            />
          ) : null}
          {DEMO_PLACES.map((place) => (
            <Stop
              key={place.id}
              place={place}
              label={label(place)}
              selected={selected.includes(place.id)}
              order={position(place.id)}
              onToggle={() => toggle(place.id)}
            />
          ))}
        </svg>
      </div>

      <div className="flex min-h-10 flex-wrap items-center gap-2">
        <AnimatePresence mode="popLayout">
          {(plan?.order ?? chosen).map((place, index) => (
            <motion.span
              key={place.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                delay: plan ? index * 0.12 : 0,
                duration: 0.35,
                ease: EASE_OUT_EXPO,
              }}
              className="inline-flex items-center gap-1.5 glassy-full px-2.5 py-1 text-xs font-medium"
            >
              {plan ? (
                <span className="flex size-4 items-center justify-center rounded-full bg-primary text-2xs text-white">
                  {index + 1}
                </span>
              ) : null}
              {label(place)}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {plan
            ? t("plannerResult", {
                stops: plan.order.length,
                minutes: plan.minutes,
              })
            : t("plannerHint")}
        </p>
        <div className="flex gap-1.5">
          <Button
            size="icon"
            variant="ghost"
            aria-label={t("plannerReset")}
            onClick={reset}
          >
            <RotateCcw />
          </Button>
          <Button
            size="sm"
            disabled={chosen.length < 2}
            onClick={() => {
              setTouched(true);
              setPlan(bestOrder(chosen));
            }}
          >
            <Route />
            {t("plannerOrder")}
          </Button>
        </div>
      </div>
    </div>
  );
};

type StopProps = {
  place: DemoPlace;
  label: string;
  selected: boolean;
  order: number;
  onToggle: () => void;
};

const Stop = ({ place, label, selected, order, onToggle }: StopProps) => {
  const { x, y } = project(place);
  const onKeyDown = (event: KeyboardEvent<SVGGElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onToggle();
  };

  return (
    <g
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={label}
      onClick={onToggle}
      onKeyDown={onKeyDown}
      className="group cursor-pointer outline-none"
    >
      {/* Bigger invisible hit area so the small dots are easy to tap on a phone. */}
      <circle cx={x} cy={y} r={6} className="fill-transparent" />
      <circle
        cx={x}
        cy={y}
        r={selected ? 3.2 : 2.2}
        className={cn(
          "transition-all duration-300 group-focus-visible:stroke-ring",
          selected
            ? "fill-primary stroke-white"
            : "fill-card stroke-primary/60 group-hover:fill-primary/30",
        )}
        strokeWidth={0.8}
      />
      {order >= 0 ? (
        <text
          x={x}
          y={y + 1.1}
          textAnchor="middle"
          className="pointer-events-none fill-white text-[3px] font-bold"
        >
          {order + 1}
        </text>
      ) : null}
      <text
        x={x}
        y={y - 4.6}
        textAnchor="middle"
        className={cn(
          "pointer-events-none text-[3px] font-medium",
          selected ? "fill-foreground" : "fill-muted-foreground",
        )}
      >
        {label}
      </text>
    </g>
  );
};
