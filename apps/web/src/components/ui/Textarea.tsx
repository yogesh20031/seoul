import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";
import { fieldClassName } from "./field-styles";

export const Textarea = ({
  className,
  rows = 4,
  ...props
}: ComponentPropsWithRef<"textarea">) => (
  <textarea
    rows={rows}
    className={cn(fieldClassName, "resize-y", className)}
    {...props}
  />
);
