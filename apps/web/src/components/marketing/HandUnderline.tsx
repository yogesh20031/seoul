"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";

// Revealed with a clip rather than a dashed pathLength: Chrome breaks the dash into pieces once a
// non-scaling stroke is stretched wide, as under a big headline.
const inset = (value: number) => `inset(-4px ${(1 - value) * 100}% -4px -4px)`;

/** A hand-drawn underline whose drawing follows `progress` (0–1). */
export const HandUnderline = ({
  progress,
}: {
  progress: MotionValue<number>;
}) => {
  const reduce = useReducedMotion();
  const full = useMotionValue(1);
  const clipPath = useTransform(reduce ? full : progress, inset);

  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
      className="absolute -bottom-1 left-0 h-3 w-full overflow-visible text-kr-red"
      style={{ clipPath }}
    >
      <path
        d="M2 9 C 25 3, 75 13, 98 6"
        fill="none"
        className="stroke-current"
        strokeWidth={3}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </motion.svg>
  );
};
