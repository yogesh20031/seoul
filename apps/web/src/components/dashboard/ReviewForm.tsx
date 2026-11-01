"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { createReviewAction, type ReviewFormState } from "@/actions/reviews";
import { Field } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/cn";

type ReviewFormProps = {
  guideId: string;
  guideName: string;
  bookingId?: string;
  soloRequestId?: string;
};

type StarOptionProps = {
  stars: Stars;
  lit: boolean;
  checked: boolean;
  label: string;
  onPick: (stars: Stars) => void;
  onPreview: (stars: Stars | null) => void;
};

type Stars = (typeof STARS)[number];

const STARS = [1, 2, 3, 4, 5] as const;
const initialState: ReviewFormState = { status: "idle" };

export const ReviewForm = ({
  guideId,
  guideName,
  bookingId,
  soloRequestId,
}: ReviewFormProps) => {
  const t = useTranslations("Dashboard");
  const [state, formAction] = useActionState(createReviewAction, initialState);
  // No default: a pre-filled 5 would quietly inflate scores for anyone who just hits "Post".
  const [rating, setRating] = useState<Stars | null>(null);
  const [preview, setPreview] = useState<Stars | null>(null);
  const formId = bookingId ?? soloRequestId ?? guideId;
  const shown = preview ?? rating;

  if (state.status === "success" && state.guideRating) {
    return (
      <FormMessage tone="success">
        {t("reviewedScore", {
          name: guideName,
          score: state.guideRating.ratingAvg.toFixed(1),
          count: state.guideRating.ratingCount,
        })}
      </FormMessage>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="guideId" value={guideId} />
      {bookingId ? (
        <input type="hidden" name="bookingId" value={bookingId} />
      ) : null}
      {soloRequestId ? (
        <input type="hidden" name="soloRequestId" value={soloRequestId} />
      ) : null}
      {state.message ? (
        <FormMessage tone="error">{state.message}</FormMessage>
      ) : null}
      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1 text-2sm font-medium">
          {t("reviewTitle", { name: guideName })}
        </legend>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1" onMouseLeave={() => setPreview(null)}>
            {STARS.map((stars) => (
              <StarOption
                key={stars}
                stars={stars}
                lit={shown !== null && stars <= shown}
                checked={rating === stars}
                label={t("starsLabel", { count: stars })}
                onPick={setRating}
                onPreview={setPreview}
              />
            ))}
          </div>
          <span
            aria-live="polite"
            className={cn(
              "text-sm",
              shown ? "font-medium" : "text-muted-foreground",
            )}
          >
            {shown ? t(`ratingLabels.${shown}`) : t("pickRating")}
          </span>
        </div>
        {state.fieldErrors?.rating ? (
          <p className="text-xs text-destructive">{t("pickRating")}</p>
        ) : null}
      </fieldset>
      <Field
        label={t("comment")}
        htmlFor={`comment-${formId}`}
        error={state.fieldErrors?.comment}
      >
        <Textarea
          id={`comment-${formId}`}
          name="comment"
          rows={2}
          maxLength={1000}
          defaultValue={state.values?.comment}
          placeholder={t("commentPlaceholder")}
        />
      </Field>
      <SubmitButton
        size="sm"
        className="self-start"
        disabled={rating === null}
        pendingLabel={t("submittingReview")}
      >
        {t("submitReview")}
      </SubmitButton>
    </form>
  );
};

// A real radio per star keeps arrow-key navigation and form submission native.
const StarOption = ({
  stars,
  lit,
  checked,
  label,
  onPick,
  onPreview,
}: StarOptionProps) => (
  <label
    className="cursor-pointer rounded-md p-0.5 has-focus-visible:ring-2 has-focus-visible:ring-primary"
    onMouseEnter={() => onPreview(stars)}
  >
    <input
      type="radio"
      name="rating"
      value={stars}
      checked={checked}
      onChange={() => onPick(stars)}
      required
      className="sr-only"
      aria-label={label}
    />
    <Star
      aria-hidden
      className={cn(
        "size-7 transition-colors duration-150",
        lit
          ? "fill-amber-400 text-amber-400"
          : "fill-transparent text-muted-foreground/50",
      )}
    />
  </label>
);
