"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import type { AuthUser } from "@seoul/shared";
import { updateMeAction } from "@/actions/profile";
import { Field } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/Textarea";
import { idleState } from "@/lib/form";

type ProfileFormProps = {
  user: AuthUser;
  bio: string | null;
  country: string | null;
};

export const ProfileForm = ({ user, bio, country }: ProfileFormProps) => {
  const t = useTranslations("Dashboard");
  const tAuth = useTranslations("Auth");
  const tCommon = useTranslations("Common");
  const [state, formAction] = useActionState(updateMeAction, idleState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.status === "success" ? (
        <FormMessage tone="success">{t("saved")}</FormMessage>
      ) : null}
      {state.message ? (
        <FormMessage tone="error">{state.message}</FormMessage>
      ) : null}
      <Field
        label={tAuth("name")}
        htmlFor="name"
        error={state.fieldErrors?.name}
      >
        <Input
          id="name"
          name="name"
          defaultValue={user.name}
          required
          minLength={2}
          maxLength={60}
        />
      </Field>
      <Field
        label={t("country")}
        htmlFor="country"
        error={state.fieldErrors?.country}
      >
        <Input
          id="country"
          name="country"
          defaultValue={country ?? ""}
          maxLength={56}
        />
      </Field>
      <Field label={t("bio")} htmlFor="bio" error={state.fieldErrors?.bio}>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={bio ?? ""}
          maxLength={500}
        />
      </Field>
      <Field
        label={t("avatarUrl")}
        htmlFor="avatarUrl"
        error={state.fieldErrors?.avatarUrl}
      >
        <Input
          id="avatarUrl"
          name="avatarUrl"
          type="url"
          defaultValue={user.avatarUrl ?? ""}
          placeholder="https://…"
        />
      </Field>
      <SubmitButton className="self-start" pendingLabel={tCommon("saving")}>
        {tCommon("save")}
      </SubmitButton>
    </form>
  );
};
