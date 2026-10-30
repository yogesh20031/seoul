import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
};

export const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  align = "left",
  action,
  className,
}: SectionHeaderProps) => (
  <div
    className={cn(
      "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
      align === "center" &&
        "items-center text-center sm:flex-col sm:items-center",
      className,
    )}
  >
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-2",
        align === "center" && "items-center",
      )}
    >
      {eyebrow ? (
        <span className="text-xs font-semibold tracking-widest text-primary uppercase">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-sm text-pretty text-text-secondary sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
    {action}
  </div>
);
