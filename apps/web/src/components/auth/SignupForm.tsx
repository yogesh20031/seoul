"use client";

import { useActionState, type ReactNode } from "react";
import { Compass, Flag } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Role } from "@seoul/shared";
import { signupAction } from "@/actions/auth";
import { Field } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { idleState } from "@/lib/form";

type SignupFormProps = { initialRole: Role; next: string | null };

export const SignupForm = ({ initialRole, next }: SignupFormProps) => {
  const t = useTranslations("Auth");
  const [state, formAction] = useActionState(signupAction, idleState);
  // After a failed submit, keep the role the user picked rather than the one from the URL.
  const role =
    state.values?.role === "GUIDE" || state.values?.role === "TRAVELLER"
      ? state.values.role
      : initialRole;

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      {next ? <input type="hidden" name="next" value={next} /> : null}
      {state.message ? (
        <FormMessage tone="error">{state.message}</FormMessage>
      ) : null}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-2sm font-medium">{t("role")}</legend>
        <div className="grid grid-cols-2 gap-3">
          <RoleOption
            value="TRAVELLER"
            defaultChecked={role === "TRAVELLER"}
            icon={<Compass />}
            title={t("traveller")}
            hint={t("travellerHint")}
          />
          <RoleOption
            value="GUIDE"
            defaultChecked={role === "GUIDE"}
            icon={<Flag />}
            title={t("guide")}
            hint={t("guideHint")}
          />
        </div>
      </fieldset>

      <Field label={t("name")} htmlFor="name" error={state.fieldErrors?.name}>
        <Input
          id="name"
          name="name"
          defaultValue={state.values?.name}
          autoComplete="name"
          required
          aria-invalid={Boolean(state.fieldErrors?.name)}
        />
      </Field>
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
        hint={t("passwordHint")}
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          aria-invalid={Boolean(state.fieldErrors?.password)}
        />
      </Field>
      <SubmitButton size="lg" className="mt-2 w-full">
        {t("submitSignup")}
      </SubmitButton>
    </form>
  );
};

type RoleOptionProps = {
  value: Role;
  defaultChecked: boolean;
  icon: ReactNode;
  title: string;
  hint: string;
};

const RoleOption = ({
  value,
  defaultChecked,
  icon,
  title,
  hint,
}: RoleOptionProps) => (
  <label className="flex cursor-pointer flex-col gap-1.5 glassy-md p-4 transition-shadow has-checked:ring-2 has-checked:ring-primary [&_svg]:size-5">
    <input
      type="radio"
      name="role"
      value={value}
      defaultChecked={defaultChecked}
      className="sr-only"
    />
    <span className="text-primary">{icon}</span>
    <span className="text-sm font-semibold">{title}</span>
    <span className="text-xs text-muted-foreground">{hint}</span>
  </label>
);
