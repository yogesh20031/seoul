"use client";

import { useActionState } from "react";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { createReviewAction } from "@/actions/reviews";
import { Field } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/Textarea";
import { idleState } from "@/lib/form";

type ReviewFormProps = {
  guideId: string;
  guideName: string;
  bookingId?: string;
  soloRequestId?: string;
};

const RATINGS = [5, 4, 3, 2, 1] as const;

export const ReviewForm = ({
  guideId,
  guideName,
  bookingId,
  soloRequestId,
}: ReviewFormProps) => {
  const t = useTranslations("Dashboard");
  const [state, formAction] = useActionState(createReviewAction, idleState);
  const formId = bookingId ?? soloRequestId ?? guideId;

  if (state.status === "success")
    return <FormMessage tone="success">{t("reviewed")}</FormMessage>;

  return (
    <details className="group">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-primary hover:underline [&::-webkit-details-marker]:hidden">
        <Star className="size-4" />
        {t("review")}
      </summary>
      <form action={formAction} className="mt-3 flex flex-col gap-3">
        <input type="hidden" name="guideId" value={guideId} />
        {bookingId ? (
          <input type="hidden" name="bookingId" value={bookingId} />
        ) : null}
        {soloRequestId ? (
          <input type="hidden" name="soloRequestId" value={soloRequestId} />
        ) : null}
        <p className="text-sm font-medium">
          {t("reviewTitle", { name: guideName })}
        </p>
        {state.message ? (
          <FormMessage tone="error">{state.message}</FormMessage>
        ) : null}
        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1 text-2sm font-medium">{t("rating")}</legend>
          {/* Reversed order + peer selectors light up every star up to the hovered or checked one. */}
          <div className="flex flex-row-reverse justify-end gap-1">
            {RATINGS.map((rating) => (
              <label
                key={rating}
                className="peer cursor-pointer text-muted-foreground/40 peer-hover:text-amber-400 peer-has-checked:text-amber-400 hover:text-amber-400 has-checked:text-amber-400"
              >
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  defaultChecked={rating === 5}
                  className="sr-only"
                />
                <Star
                  className="size-6 fill-current"
                  aria-label={`${rating}`}
                />
              </label>
            ))}
          </div>
        </fieldset>
        <Field
          label={t("comment")}
          htmlFor={`comment-${formId}`}
          error={state.fieldErrors?.comment}
        >
          <Textarea
            id={`comment-${formId}`}
            name="comment"
            rows={3}
            maxLength={1000}
            placeholder={t("commentPlaceholder")}
          />
        </Field>
        <SubmitButton size="sm" className="self-start">
          {t("submitReview")}
        </SubmitButton>
      </form>
    </details>
  );
};
