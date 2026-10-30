"use client";

import { useActionState } from "react";
import { CalendarPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { requestSoloAction } from "@/actions/solo";
import { DatePicker } from "@/components/ui/DatePicker";
import { Field } from "@/components/ui/Field";
import { TimePicker } from "@/components/ui/TimePicker";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/Textarea";
import { idleState } from "@/lib/form";

type SoloRequestFormProps = {
  guideId: string;
  guideName: string;
  minDate: string;
};

export const SoloRequestForm = ({
  guideId,
  guideName,
  minDate,
}: SoloRequestFormProps) => {
  const t = useTranslations("Guides");
  const [state, formAction] = useActionState(requestSoloAction, idleState);

  if (state.status === "success")
    return (
      <FormMessage tone="success">
        {t("requestSent", { name: guideName })}
      </FormMessage>
    );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="guideId" value={guideId} />
      {state.message ? (
        <FormMessage tone="error">{state.message}</FormMessage>
      ) : null}
      <div className="grid grid-cols-2 gap-3">
        <Field
          label={t("requestDate")}
          htmlFor="solo-date"
          error={state.fieldErrors?.date}
        >
          <DatePicker id="solo-date" name="date" min={minDate} required />
        </Field>
        <Field
          label={t("requestTime")}
          htmlFor="solo-time"
          error={state.fieldErrors?.startTime}
        >
          <TimePicker id="solo-time" name="startTime" defaultValue="10:00" />
        </Field>
      </div>
      <Field
        label={t("requestNote")}
        htmlFor="solo-note"
        error={state.fieldErrors?.note}
      >
        <Textarea
          id="solo-note"
          name="note"
          rows={3}
          placeholder={t("requestNotePlaceholder")}
          maxLength={1000}
        />
      </Field>
      <SubmitButton className="w-full">
        <CalendarPlus />
        {t("requestSubmit")}
      </SubmitButton>
    </form>
  );
};
