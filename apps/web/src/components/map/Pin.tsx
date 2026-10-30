import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PinProps = {
  tone?: string;
  active?: boolean;
  children?: ReactNode;
  label: string;
};

export const Pin = ({
  tone = "bg-primary",
  active = false,
  children,
  label,
}: PinProps) => (
  <span
    aria-label={label}
    className={cn(
      "flex size-7 items-center justify-center rounded-full border-2 border-white text-2xs font-bold text-white shadow-lg transition-transform",
      tone,
      active && "scale-125 ring-4 ring-primary/40",
    )}
  >
    {children}
  </span>
);
