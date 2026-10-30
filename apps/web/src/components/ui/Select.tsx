import type { ComponentPropsWithRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { fieldClassName } from "./field-styles";

export const Select = ({
  className,
  children,
  ...props
}: ComponentPropsWithRef<"select">) => (
  <div className="relative">
    <select
      className={cn(fieldClassName, "h-11 appearance-none pr-9", className)}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
  </div>
);
