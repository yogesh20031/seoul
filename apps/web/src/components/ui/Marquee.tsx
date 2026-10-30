import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type MarqueeProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
  reverse?: boolean;
  pauseOnHover?: boolean;
  repeat?: number;
  speed?: "slow" | "normal" | "fast";
};

const SPEEDS = {
  slow: "[--duration:80s]",
  normal: "[--duration:40s]",
  fast: "[--duration:15s]",
} as const;

export const Marquee = ({
  className,
  children,
  reverse = false,
  pauseOnHover = false,
  repeat = 4,
  speed = "normal",
  ...props
}: MarqueeProps) => (
  <div
    {...props}
    className={cn(
      "group flex [gap:var(--gap)] overflow-hidden p-1 [--gap:1rem]",
      SPEEDS[speed],
      className,
    )}
  >
    {Array.from({ length: repeat }, (_, i) => (
      <div
        key={i}
        aria-hidden={i > 0}
        className={cn(
          "flex shrink-0 animate-marquee items-center [gap:var(--gap)]",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {children}
      </div>
    ))}
  </div>
);
