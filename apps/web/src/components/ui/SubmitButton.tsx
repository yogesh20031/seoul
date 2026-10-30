"use client";

import type { ComponentPropsWithRef } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "./Button";
import type { ButtonVariantProps } from "./button-variants";

type SubmitButtonProps = Omit<ComponentPropsWithRef<"button">, "type"> &
  ButtonVariantProps & { pendingLabel?: string };

export const SubmitButton = ({
  children,
  pendingLabel,
  disabled,
  ...props
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      {...props}
    >
      {pending ? <Loader2 className="animate-spin" /> : null}
      {pending && pendingLabel ? pendingLabel : children}
    </Button>
  );
};
