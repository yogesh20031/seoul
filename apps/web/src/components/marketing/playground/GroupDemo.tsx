"use client";

import { useEffect, useRef, useState } from "react";
import { Check, MapPin, UserPlus } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { EASE_OUT_EXPO } from "../motion";

const CAPACITY = 6;
const JOIN_EVERY_MS = 1300;
const HOLD_FULL_MS = 4000;

// Demo people only; these mirror the kind of public profile members see on a real tour.
const MEMBERS = [
  {
    id: "emma",
    name: "Emma",
    country: "🇬🇧",
    avatar: "https://i.pravatar.cc/96?u=seoulmate-demo-emma",
  },
  {
    id: "aiko",
    name: "Aiko",
    country: "🇯🇵",
    avatar: "https://i.pravatar.cc/96?u=seoulmate-demo-aiko",
  },
  {
    id: "lucas",
    name: "Lucas",
    country: "🇧🇷",
    avatar: "https://i.pravatar.cc/96?u=seoulmate-demo-lucas",
  },
  {
    id: "jonas",
    name: "Jonas",
    country: "🇩🇪",
    avatar: "https://i.pravatar.cc/96?u=seoulmate-demo-jonas",
  },
  {
    id: "priya",
    name: "Priya",
    country: "🇮🇳",
    avatar: "https://i.pravatar.cc/96?u=seoulmate-demo-priya",
  },
] as const;

export const GroupDemo = () => {
  const t = useTranslations("Playground");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [joined, setJoined] = useState(reduce ? 3 : 0);
  const [youIn, setYouIn] = useState(false);

  // Strangers trickle in while the card is on screen; once full it starts over, unless you joined.
  useEffect(() => {
    if (!inView || reduce || youIn) return;
    const full = joined >= MEMBERS.length;
    const id = window.setTimeout(
      () => setJoined(full ? 0 : joined + 1),
      full ? HOLD_FULL_MS : JOIN_EVERY_MS,
    );
    return () => window.clearTimeout(id);
  }, [inView, reduce, youIn, joined]);

  const people = MEMBERS.slice(0, Math.min(joined, CAPACITY - 1));
  const taken = people.length + (youIn ? 1 : 0);
  const canJoin = !youIn && taken < CAPACITY;

  return (
    <div ref={ref} className="flex flex-1 flex-col gap-4">
      <div className="rounded-2xl bg-card/70 p-4 ring-1 ring-border/60">
        <p className="text-sm font-semibold">{t("groupTour")}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3" />
          {t("groupWhen")}
        </p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full origin-left rounded-full bg-primary"
            initial={false}
            animate={{ scaleX: taken / CAPACITY }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          />
        </div>
        <p className="mt-1.5 text-2xs text-muted-foreground tabular-nums">
          {t("groupSeats", { taken, capacity: CAPACITY })}
        </p>
      </div>

      <ul className="flex min-h-36 flex-col gap-2" aria-live="polite">
        <AnimatePresence initial={false}>
          {people.map((member) => (
            <motion.li
              key={member.id}
              layout
              initial={{ opacity: 0, x: -16, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
              className="flex items-center gap-2.5"
            >
              <Avatar name={member.name} src={member.avatar} size={28} />
              <span className="text-sm font-medium">{member.name}</span>
              <span aria-hidden>{member.country}</span>
            </motion.li>
          ))}
          {youIn ? (
            <motion.li
              key="you"
              layout
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
              className="flex items-center gap-2.5"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-2xs font-bold text-white ring-2 ring-primary/30">
                {t("groupYou")}
              </span>
              <span className="text-sm font-semibold text-primary">
                {t("groupYou")}
              </span>
            </motion.li>
          ) : null}
        </AnimatePresence>
      </ul>

      <Button
        className="mt-auto self-start"
        size="sm"
        variant={youIn ? "secondary" : "primary"}
        disabled={!canJoin}
        onClick={() => setYouIn(true)}
      >
        {youIn ? <Check /> : <UserPlus />}
        {youIn ? t("groupJoined") : t("groupJoin")}
      </Button>
    </div>
  );
};
