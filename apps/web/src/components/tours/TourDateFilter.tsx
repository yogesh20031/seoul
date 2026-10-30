"use client";

import { useState, useTransition, type ComponentPropsWithRef } from "react";
import { CalendarDays, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { DateRange } from "react-day-picker";
import { enUS, ko } from "react-day-picker/locale";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Calendar } from "@/components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/cn";
import { withQuery } from "@/lib/url";

type Range = { from?: string; to?: string };

type TourDateFilterProps = Range & {
  total: number;
  /** Today in Seoul as YYYY-MM-DD, from the server, so presets don't follow the visitor's own time zone. */
  today: string;
};

type Preset = "anyTime" | "thisWeekend" | "next7" | "next30";

const PRESETS: Preset[] = ["anyTime", "thisWeekend", "next7", "next30"];

/** One quiet row: result count, quick date presets, and a range calendar for anything else. Applies instantly. */
export const TourDateFilter = ({
  from,
  to,
  total,
  today,
}: TourDateFilterProps) => {
  const t = useTranslations("Tours");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  // The calendar's in-progress pick: a range only applies once both ends are chosen.
  const [draft, setDraft] = useState<DateRange | undefined>(undefined);

  const apply = (range: Range) =>
    startTransition(() =>
      router.replace(withQuery(pathname, range), { scroll: false }),
    );

  const presetRanges = Object.fromEntries(
    PRESETS.map((preset) => [preset, presetRange(preset, today)]),
  );
  const activePreset = PRESETS.find(
    (preset) =>
      presetRanges[preset]?.from === from && presetRanges[preset]?.to === to,
  );
  const customLabel =
    !activePreset && from && to ? formatRange(from, to, locale) : null;

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p
        className={cn(
          "flex items-center gap-2 text-sm text-muted-foreground transition-opacity",
          pending && "opacity-60",
        )}
        aria-live="polite"
      >
        {pending ? <Loader2 className="size-3.5 animate-spin" /> : null}
        {t("count", { count: total })}
      </p>

      <div className="-mx-1 scrollbar-none flex items-center gap-1 overflow-x-auto px-1">
        {PRESETS.map((preset) => (
          <FilterChip
            key={preset}
            active={preset === activePreset}
            onClick={() => apply(presetRanges[preset] ?? {})}
          >
            {t(preset)}
          </FilterChip>
        ))}
        <Popover
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            setDraft(undefined);
          }}
        >
          <PopoverTrigger asChild>
            <FilterChip active={Boolean(customLabel)}>
              <CalendarDays className="size-3.5" />
              {customLabel ?? t("dates")}
            </FilterChip>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-3">
            <p className="mb-2 px-1 text-xs text-muted-foreground">
              {t("pickRange")}
            </p>
            <Calendar
              mode="range"
              numberOfMonths={2}
              // Two months side by side from md up; on phones only the first, so the popover stays short.
              classNames={{
                month: "flex w-full flex-col gap-3 [&+&]:hidden md:[&+&]:flex",
              }}
              locale={locale === "ko" ? ko : enUS}
              selected={
                draft ?? { from: parseIsoDate(from), to: parseIsoDate(to) }
              }
              defaultMonth={parseIsoDate(from) ?? parseIsoDate(today)}
              disabled={{ before: parseIsoDate(today) ?? new Date() }}
              onSelect={(range, picked) => {
                // Start a fresh range on the first click instead of extending the one already applied.
                const next = draft ? range : { from: picked, to: undefined };
                setDraft(next);
                if (draft && next?.from && next.to) {
                  apply({ from: toIsoDate(next.from), to: toIsoDate(next.to) });
                  setOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

type FilterChipProps = ComponentPropsWithRef<"button"> & { active: boolean };

const FilterChip = ({ active, className, ...props }: FilterChipProps) => (
  <button
    type="button"
    aria-pressed={active}
    className={cn(
      "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-medium whitespace-nowrap transition-colors",
      active
        ? "bg-primary/12 text-primary dark:text-primary-900"
        : "text-muted-foreground hover:bg-card-hover hover:text-foreground",
      className,
    )}
    {...props}
  />
);

// Date maths on YYYY-MM-DD strings in UTC, so the visitor's time zone can't shift a day.
const addDays = (iso: string, days: number) => {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const presetRange = (preset: Preset, today: string): Range | undefined => {
  if (preset === "next7") return { from: today, to: addDays(today, 6) };
  if (preset === "next30") return { from: today, to: addDays(today, 29) };
  if (preset === "thisWeekend") {
    const weekday = new Date(`${today}T00:00:00Z`).getUTCDay();
    // Sunday counts as "this weekend" too, so it only covers the rest of today.
    if (weekday === 0) return { from: today, to: today };
    const saturday = addDays(today, (6 - weekday + 7) % 7);
    return { from: weekday === 6 ? today : saturday, to: addDays(saturday, 1) };
  }
  return undefined;
};

const formatRange = (from: string, to: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).formatRange(new Date(`${from}T00:00:00Z`), new Date(`${to}T00:00:00Z`));

// Calendar days are local Date objects; build them from parts so they don't shift across time zones.
const parseIsoDate = (iso: string | undefined) => {
  const match = iso ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso) : null;
  return match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : undefined;
};

const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
