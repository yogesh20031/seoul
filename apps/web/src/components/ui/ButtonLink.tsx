import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { buttonVariants, type ButtonVariantProps } from "./button-variants";

type ButtonLinkProps = ComponentProps<typeof Link> & ButtonVariantProps;

export const ButtonLink = ({
  className,
  variant,
  size,
  ...props
}: ButtonLinkProps) => (
  <Link
    className={cn(buttonVariants({ variant, size }), className)}
    {...props}
  />
);
