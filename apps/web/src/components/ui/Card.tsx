import type { ComponentPropsWithRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const cardVariants = cva("relative text-card-foreground", {
  variants: {
    variant: {
      glass: "glassy-2xl",
      strong: "glassy-strong",
      solid: "rounded-2xl border border-border bg-card shadow-sm",
    },
    padding: { none: "", sm: "p-4", md: "p-5 sm:p-6", lg: "p-6 sm:p-8" },
    interactive: {
      true: "transition-transform duration-200 ease-out-strong hover:-translate-y-0.5 hover:shadow-lg",
    },
  },
  defaultVariants: { variant: "glass", padding: "md" },
});

type CardProps = ComponentPropsWithRef<"div"> &
  VariantProps<typeof cardVariants>;

export const Card = ({
  className,
  variant,
  padding,
  interactive,
  ...props
}: CardProps) => (
  <div
    className={cn(cardVariants({ variant, padding, interactive }), className)}
    {...props}
  />
);
