"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { loginAction } from "@/actions/auth";
import { Field } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { idleState } from "@/lib/form";

export const LoginForm = ({ next }: { next: string | null }) => {
  const t = useTranslations("Auth");
  const [state, formAction] = useActionState(loginAction, idleState);

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      {next ? <input type="hidden" name="next" value={next} /> : null}
      {state.message ? (
        <FormMessage tone="error">{state.message}</FormMessage>
      ) : null}
      <Field
        label={t("email")}
        htmlFor="email"
        error={state.fieldErrors?.email}
      >
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={state.values?.email}
          autoComplete="email"
          required
          aria-invalid={Boolean(state.fieldErrors?.email)}
        />
      </Field>
      <Field
        label={t("password")}
        htmlFor="password"
        error={state.fieldErrors?.password}
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(state.fieldErrors?.password)}
        />
      </Field>
      <SubmitButton size="lg" className="mt-2 w-full">
        {t("submitLogin")}
      </SubmitButton>
    </form>
  );
};
