"use client";

import { useState, useTransition } from "react";
import { Check, Copy, Save } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { saveItineraryAction } from "@/actions/itineraries";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card } from "@/components/ui/Card";
import { DatePicker } from "@/components/ui/DatePicker";
import { Field } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";

type SavePlanFormProps = {
  placeIds: string[];
  startTime: string;
  canSave: boolean;
};

export const SavePlanForm = ({
  placeIds,
  startTime,
  canSave,
}: SavePlanFormProps) => {
  const t = useTranslations("Planner");
  const locale = useLocale();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!canSave) {
    return (
      <Card className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-secondary">{t("loginToSave")}</p>
        <ButtonLink
          href={`/login?next=${encodeURIComponent(`/planner?places=${placeIds.join(",")}`)}`}
          size="sm"
          variant="secondary"
        >
          {t("save")}
        </ButtonLink>
      </Card>
    );
  }

  const save = () => {
    setError(null);
    startTransition(async () => {
      const response = await saveItineraryAction({
        placeIds,
        startTime,
        title,
        date: date || undefined,
      });
      if (!response.ok) {
        setError(response.message);
        return;
      }
      setShareUrl(
        `${window.location.origin}/${locale}/planner/${response.itinerary.shareToken}`,
      );
    });
  };

  const copy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  };

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-base font-semibold">{t("saveTitle")}</h2>
      {shareUrl ? (
        <div className="flex flex-col gap-2">
          <FormMessage tone="success">{t("saved")}</FormMessage>
          <div className="flex gap-2">
            <Input readOnly value={shareUrl} aria-label={t("saved")} />
            <Button variant="secondary" className="h-11" onClick={copy}>
              {copied ? <Check /> : <Copy />}
              {copied ? t("copied") : t("copy")}
            </Button>
          </div>
        </div>
      ) : (
        <>
          {error ? <FormMessage tone="error">{error}</FormMessage> : null}
          <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
            <Field label={t("planTitle")} htmlFor="plan-title">
              <Input
                id="plan-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={80}
              />
            </Field>
            <Field label={t("planDate")} htmlFor="plan-date">
              <DatePicker id="plan-date" value={date} onChange={setDate} />
            </Field>
          </div>
          <Button
            onClick={save}
            disabled={pending || title.trim().length < 2}
            className="self-start"
          >
            <Save />
            {t("save")}
          </Button>
        </>
      )}
    </Card>
  );
};
