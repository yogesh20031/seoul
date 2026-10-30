import type { ComponentPropsWithRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-2xs font-medium whitespace-nowrap [&_svg]:size-3",
  {
    variants: {
      tone: {
        neutral: "glassy-full text-foreground",
        primary:
          "bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary-900",
        success: "bg-success/12 text-success",
        warning: "bg-warning/15 text-warning",
        danger: "bg-destructive/12 text-destructive",
        red: "bg-kr-red/12 text-kr-red",
        blue: "bg-kr-blue/12 text-kr-blue",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

type BadgeProps = ComponentPropsWithRef<"span"> &
  VariantProps<typeof badgeVariants>;

export const Badge = ({ className, tone, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ tone }), className)} {...props} />
);
