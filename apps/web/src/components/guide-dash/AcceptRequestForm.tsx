"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { acceptSoloAction } from "@/actions/solo";
import { LazyPinPicker } from "@/components/map/lazy";
import { Field } from "@/components/ui/Field";
import { TimePicker } from "@/components/ui/TimePicker";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { idleState } from "@/lib/form";

type AcceptRequestFormProps = { requestId: string; startTime: string };

export const AcceptRequestForm = ({
  requestId,
  startTime,
}: AcceptRequestFormProps) => {
  const t = useTranslations("GuideDash");
  const tGuides = useTranslations("Guides");
  const [state, formAction] = useActionState(acceptSoloAction, idleState);
  const pinError =
    state.fieldErrors?.meetingLat ?? state.fieldErrors?.meetingLng;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="requestId" value={requestId} />
      <p className="text-sm font-medium">{t("acceptTitle")}</p>
      {state.message ? (
        <FormMessage tone="error">{state.message}</FormMessage>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
        <Field
          label={t("meetingName")}
          htmlFor={`meeting-${requestId}`}
          error={state.fieldErrors?.meetingName}
        >
          <Input
            id={`meeting-${requestId}`}
            name="meetingName"
            placeholder={t("meetingNamePlaceholder")}
            required
            minLength={3}
          />
        </Field>
        <Field
          label={tGuides("requestTime")}
          htmlFor={`time-${requestId}`}
          error={state.fieldErrors?.startTime}
        >
          <TimePicker
            id={`time-${requestId}`}
            name="startTime"
            defaultValue={startTime}
          />
        </Field>
      </div>
      <LazyPinPicker
        latName="meetingLat"
        lngName="meetingLng"
        hint={t("pickOnMap")}
        className="h-56"
      />
      {pinError ? (
        <p className="text-xs text-destructive">{t("pickOnMap")}</p>
      ) : null}
      <SubmitButton size="sm" className="self-start">
        <Check />
        {t("accept")}
      </SubmitButton>
    </form>
  );
};
