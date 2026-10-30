import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/cn";
import { buttonVariants, type ButtonVariantProps } from "./button-variants";

type ButtonProps = ComponentPropsWithRef<"button"> & ButtonVariantProps;

export const Button = ({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cn(buttonVariants({ variant, size }), className)}
    {...props}
  />
);
