import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
};

export const PageHeader = ({
  title,
  subtitle,
  eyebrow,
  action,
  className,
}: PageHeaderProps) => (
  <header
    className={cn(
      "flex flex-col gap-4 pt-10 pb-8 sm:flex-row sm:items-end sm:justify-between sm:pt-14",
      className,
    )}
  >
    <div className="flex max-w-2xl flex-col gap-2">
      {eyebrow ? (
        <span className="text-xs font-semibold tracking-widest text-primary uppercase">
          {eyebrow}
        </span>
      ) : null}
      <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="text-sm text-pretty text-text-secondary sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
    {action}
  </header>
);
