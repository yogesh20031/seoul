"use client";

import { useActionState, useState } from "react";
import { CreditCard } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { bookTourAction } from "@/actions/bookings";
import { Field } from "@/components/ui/Field";
import { FormMessage } from "@/components/ui/FormMessage";
import { Select } from "@/components/ui/Select";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { formatKrw } from "@/lib/format";
import { idleState } from "@/lib/form";

type BookingFormProps = {
  tourId: string;
  pricePerPerson: number;
  seatsLeft: number;
  submitLabel: string;
};

// The API caps a single booking at 6 seats.
const MAX_SEATS_PER_BOOKING = 6;

export const BookingForm = ({
  tourId,
  pricePerPerson,
  seatsLeft,
  submitLabel,
}: BookingFormProps) => {
  const t = useTranslations("Tours");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const [state, formAction] = useActionState(bookTourAction, idleState);
  const [seats, setSeats] = useState(1);
  const options = Array.from(
    { length: Math.min(MAX_SEATS_PER_BOOKING, seatsLeft) },
    (_, i) => i + 1,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="tourId" value={tourId} />
      {state.message ? (
        <FormMessage tone="error">{state.message}</FormMessage>
      ) : null}
      <Field
        label={t("seatsLabel")}
        htmlFor="seats"
        error={state.fieldErrors?.seats}
      >
        <Select
          id="seats"
          name="seats"
          value={seats}
          onChange={(event) => setSeats(Number(event.target.value))}
        >
          {options.map((count) => (
            <option key={count} value={count}>
              {tCommon("seats", { count })}
            </option>
          ))}
        </Select>
      </Field>
      <div className="flex items-baseline justify-between border-t border-border/60 pt-3">
        <span className="text-sm text-muted-foreground">{t("total")}</span>
        <span className="text-2xl font-semibold">
          {formatKrw(seats * pricePerPerson, locale)}
        </span>
      </div>
      <SubmitButton size="lg" className="w-full">
        <CreditCard />
        {submitLabel}
      </SubmitButton>
      <p className="text-xs text-muted-foreground">{t("testCard")}</p>
    </form>
  );
};
