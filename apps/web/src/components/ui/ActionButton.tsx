"use client";

import { useActionState, useState } from "react";
import type { FormState } from "@/lib/form";
import { idleState } from "@/lib/form";
import type { ButtonVariantProps } from "./button-variants";
import { Button } from "./Button";
import { SubmitButton } from "./SubmitButton";

type ActionButtonProps = ButtonVariantProps & {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  /** Hidden fields sent with the click, e.g. the id of the row being acted on. */
  fields: Record<string, string>;
  children: string;
  /** When set, the first click asks for confirmation instead of submitting. Used for things that can't be undone. */
  confirmLabel?: string;
  className?: string;
};

export const ActionButton = ({
  action,
  fields,
  children,
  confirmLabel,
  variant,
  size = "sm",
  className,
}: ActionButtonProps) => {
  const [state, formAction] = useActionState(action, idleState);
  const [confirming, setConfirming] = useState(false);

  return (
    <form action={formAction} className="flex flex-col items-start gap-1.5">
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {confirmLabel && !confirming ? (
        <Button
          variant={variant}
          size={size}
          className={className}
          onClick={() => setConfirming(true)}
        >
          {children}
        </Button>
      ) : (
        <SubmitButton
          variant={confirmLabel ? "danger" : variant}
          size={size}
          className={className}
        >
          {confirmLabel ?? children}
        </SubmitButton>
      )}
      {state.status === "error" && state.message ? (
        <p className="text-xs text-destructive">{state.message}</p>
      ) : null}
    </form>
  );
};
