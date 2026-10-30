"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { PickerTrigger } from "./PickerTrigger";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

type TimePickerProps = {
  id?: string;
  /** Submitted with the form as HH:mm (24-hour), like a native time input. */
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Minutes between options. Tours start on the quarter hour. */
  step?: number;
  placeholder?: string;
  className?: string;
};

const HOURS = Array.from({ length: 24 }, (_, h) => h);

/**
 * Popover time picker in the same shape as monoceros' TimePicker popover (hour and minute columns),
 * without its clock face and wheel, which this site doesn't need.
 */
export const TimePicker = ({
  id,
  name,
  value,
  defaultValue = "",
  onChange,
  step = 15,
  placeholder,
  className,
}: TimePickerProps) => {
  const t = useTranslations("Picker");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [ownValue, setOwnValue] = useState(defaultValue);
  const current = value ?? ownValue;
  const [hour, minute] = parseTime(current);
  const minutes = Array.from(
    { length: Math.ceil(60 / step) },
    (_, i) => i * step,
  );

  const commit = (h: number, m: number) => {
    const next = `${pad(h)}:${pad(m)}`;
    setOwnValue(next);
    onChange?.(next);
  };

  const label =
    hour === null || minute === null
      ? null
      : new Intl.DateTimeFormat(locale, {
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date(2000, 0, 1, hour, minute));

  return (
    <div className={className}>
      {name ? <input type="hidden" name={name} value={current} /> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <PickerTrigger
            id={id}
            icon={<Clock />}
            placeholder={placeholder ?? t("pickTime")}
            label={label}
          />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 p-3">
          <div className="grid grid-cols-2 gap-2">
            <TimeColumn
              title={t("hour")}
              options={HOURS}
              selected={hour}
              onPick={(h) => commit(h, minute ?? 0)}
            />
            <TimeColumn
              title={t("minute")}
              options={minutes}
              selected={minute}
              onPick={(m) => commit(hour ?? 9, m)}
            />
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 h-9 w-full cursor-pointer rounded-full bg-primary text-sm font-medium text-white transition hover:brightness-110"
          >
            {t("done")}
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

type TimeColumnProps = {
  title: string;
  options: number[];
  selected: number | null;
  onPick: (value: number) => void;
};

const TimeColumn = ({ title, options, selected, onPick }: TimeColumnProps) => (
  <div className="flex flex-col gap-1">
    <span className="px-1 text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
      {title}
    </span>
    <div
      role="listbox"
      aria-label={title}
      className="relative scrollbar-none flex max-h-52 flex-col gap-0.5 overflow-y-auto pr-1"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="option"
          aria-selected={option === selected}
          // Opening the popover should show the chosen time, not 00 at the top of the list.
          // scrollIntoView would scroll the page too, so move only this list.
          ref={option === selected ? centerInList : undefined}
          onClick={() => onPick(option)}
          className={cn(
            "h-8 shrink-0 cursor-pointer rounded-lg text-sm tabular-nums transition-colors",
            option === selected
              ? "bg-primary font-semibold text-white"
              : "text-text-secondary hover:bg-card-hover hover:text-foreground",
          )}
        >
          {pad(option)}
        </button>
      ))}
    </div>
  </div>
);

const centerInList = (el: HTMLButtonElement | null) => {
  const list = el?.parentElement;
  if (el && list)
    list.scrollTop = el.offsetTop - list.clientHeight / 2 + el.offsetHeight / 2;
};

const pad = (n: number) => String(n).padStart(2, "0");

const parseTime = (value: string): [number | null, number | null] => {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  return match ? [Number(match[1]), Number(match[2])] : [null, null];
};
