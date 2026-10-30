"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

// The hero art drifts up and tilts back slightly as the page scrolls, so the first scroll feels alive.
export const HeroParallax = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.5,
  });
  const y = useTransform(smooth, [0, 1], [0, reduce ? 0 : -80]);
  const rotateX = useTransform(smooth, [0, 1], [0, reduce ? 0 : 8]);
  const scale = useTransform(smooth, [0, 1], [1, reduce ? 1 : 0.94]);

  return (
    <div ref={ref} className="perspective-[1200px]">
      <motion.div style={{ y, rotateX, scale }} className="origin-top">
        {children}
      </motion.div>
    </div>
  );
};
