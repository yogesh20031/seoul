import { cn } from "@/lib/cn";

export const Skeleton = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn(
      "animate-shimmer rounded-xl bg-[linear-gradient(90deg,var(--muted)_25%,color-mix(in_oklab,var(--muted)_60%,var(--card))_50%,var(--muted)_75%)] bg-size-[200%_100%]",
      className,
    )}
  />
);
