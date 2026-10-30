import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

export const Field = ({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: FieldProps) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    <label htmlFor={htmlFor} className="text-2sm font-medium text-foreground">
      {label}
    </label>
    {children}
    {error ? (
      <p id={`${htmlFor}-error`} className="text-xs text-destructive">
        {error}
      </p>
    ) : hint ? (
      <p className="text-xs text-muted-foreground">{hint}</p>
    ) : null}
  </div>
);
