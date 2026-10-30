"use client";

import { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { enUS, ko } from "react-day-picker/locale";
import { cn } from "@/lib/cn";
import { Calendar } from "./Calendar";
import { PickerTrigger } from "./PickerTrigger";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

type DatePickerProps = {
  id?: string;
  /** Submitted with the form as YYYY-MM-DD, like a native date input. */
  name?: string;
  /** Controlled value as YYYY-MM-DD ("" for none). Leave out to let the picker keep its own state. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
  /** Hides the clear button. The server still validates, since a hidden input can't block submit. */
  required?: boolean;
  placeholder?: string;
  className?: string;
};

const DAY_PICKER_LOCALE = { en: enUS, ko } as const;

/** Calendar-in-a-popover replacement for <input type="date">, built on the Calendar copied from monoceros. */
export const DatePicker = ({
  id,
  name,
  value,
  defaultValue = "",
  onChange,
  min,
  max,
  required,
  placeholder,
  className,
}: DatePickerProps) => {
  const t = useTranslations("Picker");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [ownValue, setOwnValue] = useState(defaultValue);
  const current = value ?? ownValue;
  const selected = parseIsoDate(current);
  const minDate = parseIsoDate(min);
  const maxDate = parseIsoDate(max);

  const commit = (next: string) => {
    setOwnValue(next);
    onChange?.(next);
  };

  const label = selected
    ? new Intl.DateTimeFormat(locale, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(selected)
    : null;

  return (
    <div className={cn("relative", className)}>
      {name ? <input type="hidden" name={name} value={current} /> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <PickerTrigger
            id={id}
            icon={<CalendarDays />}
            placeholder={placeholder ?? t("pickDate")}
            label={label}
            className={cn(current && !required && "pr-10")}
          />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-3">
          <Calendar
            mode="single"
            locale={DAY_PICKER_LOCALE[locale === "ko" ? "ko" : "en"]}
            selected={selected}
            defaultMonth={selected ?? minDate}
            startMonth={minDate}
            endMonth={maxDate}
            disabled={[
              ...(minDate ? [{ before: minDate }] : []),
              ...(maxDate ? [{ after: maxDate }] : []),
            ]}
            onSelect={(date) => {
              if (!date) return;
              commit(toIsoDate(date));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {current && !required ? (
        <button
          type="button"
          onClick={() => commit("")}
          aria-label={t("clear")}
          className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-card-hover hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
};

// Local-time parsing on purpose: `new Date("2026-11-03")` is UTC midnight and shows the previous day west of UTC.
const parseIsoDate = (iso: string | undefined) => {
  const match = iso ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso) : null;
  return match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : undefined;
};

const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
