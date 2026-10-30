"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import type { GuideCard } from "@seoul/shared";
import { updateGuideProfileAction } from "@/actions/profile";
import { Field } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { idleState } from "@/lib/form";

export const GuideProfileForm = ({ guide }: { guide: GuideCard }) => {
  const t = useTranslations("GuideDash.profileForm");
  const tDash = useTranslations("Dashboard");
  const tCommon = useTranslations("Common");
  const [state, formAction] = useActionState(
    updateGuideProfileAction,
    idleState,
  );
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.status === "success" ? (
        <FormMessage tone="success">{tDash("saved")}</FormMessage>
      ) : null}
      {state.message ? (
        <FormMessage tone="error">{state.message}</FormMessage>
      ) : null}
      <Field label={t("headline")} htmlFor="headline" error={errors.headline}>
        <Input
          id="headline"
          name="headline"
          defaultValue={guide.headline}
          placeholder={t("headlinePlaceholder")}
          required
          minLength={5}
          maxLength={120}
        />
      </Field>
      <Field
        label={t("languages")}
        htmlFor="languages"
        error={errors.languages}
      >
        <Input
          id="languages"
          name="languages"
          defaultValue={guide.languages.join(", ")}
          required
        />
      </Field>
      <Field
        label={t("specialties")}
        htmlFor="specialties"
        error={errors.specialties}
      >
        <Input
          id="specialties"
          name="specialties"
          defaultValue={guide.specialties.join(", ")}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("soloPrice")}
          htmlFor="soloPrice"
          error={errors.soloPrice}
        >
          <Input
            id="soloPrice"
            name="soloPrice"
            type="number"
            min={10000}
            max={2000000}
            step={1000}
            defaultValue={guide.soloPrice}
            required
          />
        </Field>
        <Field
          label={t("soloDuration")}
          htmlFor="soloDurationMin"
          error={errors.soloDurationMin}
        >
          <Input
            id="soloDurationMin"
            name="soloDurationMin"
            type="number"
            min={60}
            max={720}
            step={30}
            defaultValue={guide.soloDurationMin}
            required
          />
        </Field>
      </div>
      <SubmitButton className="self-start" pendingLabel={tCommon("saving")}>
        {tCommon("save")}
      </SubmitButton>
    </form>
  );
};
