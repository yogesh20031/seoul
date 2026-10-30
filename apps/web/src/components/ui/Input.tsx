import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";
import { fieldClassName } from "./field-styles";

export const Input = ({
  className,
  ...props
}: ComponentPropsWithRef<"input">) => (
  <input className={cn(fieldClassName, "h-11", className)} {...props} />
);
