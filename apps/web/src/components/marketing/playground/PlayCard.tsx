"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO } from "../motion";

type PlayCardProps = {
  title: string;
  hint?: string;
  index: number;
  tone?: "violet" | "red" | "blue";
  children: ReactNode;
  className?: string;
};

// Each card gets a soft wash of one accent so the three demos read as a set without being identical.
const TONE = {
  violet: "from-primary/12",
  red: "from-kr-red/10",
  blue: "from-kr-blue/12",
} as const;

export const PlayCard = ({
  title,
  hint,
  index,
  tone = "violet",
  children,
  className,
}: PlayCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ delay: index * 0.1, duration: 0.7, ease: EASE_OUT_EXPO }}
    className={cn(
      "relative flex flex-col overflow-hidden glassy-3xl bg-linear-to-br to-transparent p-6 sm:p-8",
      TONE[tone],
      className,
    )}
  >
    <h3 className="text-lg leading-snug font-semibold tracking-tight text-balance sm:text-xl">
      {title}
    </h3>
    {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    <div className="mt-6 flex flex-1 flex-col">{children}</div>
  </motion.div>
);
