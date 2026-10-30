"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/cn";
import { buttonVariants } from "./button-variants";

// Copied from monoceros' Calendar (react-day-picker v9), restyled with this site's tokens.
export const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  components,
  ...props
}: ComponentProps<typeof DayPicker>) => {
  const defaults = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar rounded-2xl p-1 [--cell-size:--spacing(9)] in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      classNames={{
        root: cn("w-fit", defaults.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaults.months),
        month: cn("flex w-full flex-col gap-3", defaults.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaults.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: "ghost" }),
          "size-(--cell-size) rounded-full p-0 select-none aria-disabled:opacity-40",
          defaults.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost" }),
          "size-(--cell-size) rounded-full p-0 select-none aria-disabled:opacity-40",
          defaults.button_next,
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaults.month_caption,
        ),
        caption_label: cn(
          "text-sm font-semibold select-none",
          defaults.caption_label,
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaults.weekdays),
        weekday: cn(
          "flex-1 text-xs font-medium text-muted-foreground select-none",
          defaults.weekday,
        ),
        week: cn("mt-1 flex w-full", defaults.week),
        day: cn(
          "group/day relative aspect-square h-full w-full p-0 text-center select-none",
          defaults.day,
        ),
        range_start: cn(
          "rounded-l-full bg-linear-to-r from-transparent from-50% to-primary/12 to-50%",
          defaults.range_start,
        ),
        range_middle: cn(defaults.range_middle),
        range_end: cn(
          "rounded-r-full bg-linear-to-l from-transparent from-50% to-primary/12 to-50%",
          defaults.range_end,
        ),
        today: cn(defaults.today),
        outside: cn("text-muted-foreground/60", defaults.outside),
        disabled: cn("text-muted-foreground opacity-40", defaults.disabled),
        hidden: cn("invisible", defaults.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className: rootClassName, rootRef, ...rest }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={rootClassName}
            {...rest}
          />
        ),
        Chevron: ({ className: iconClassName, orientation }) => {
          if (orientation === "left")
            return <ChevronLeftIcon className={cn("size-4", iconClassName)} />;
          if (orientation === "right")
            return <ChevronRightIcon className={cn("size-4", iconClassName)} />;
          return <ChevronDownIcon className={cn("size-4", iconClassName)} />;
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
};

const CalendarDayButton = ({
  className,
  day,
  modifiers,
  ...props
}: ComponentProps<typeof DayButton>) => {
  const ref = useRef<HTMLButtonElement>(null);

  // Keyboard navigation moves react-day-picker's "focused" day; real DOM focus has to follow it.
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.isoDate}
      data-selected={modifiers.selected && !modifiers.range_middle}
      data-range-middle={modifiers.range_middle}
      data-today={modifiers.today}
      className={cn(
        "flex aspect-square w-full min-w-(--cell-size) cursor-pointer items-center justify-center rounded-full text-sm text-text-secondary transition-colors",
        "hover:bg-card-hover hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        "data-[today=true]:font-semibold data-[today=true]:text-primary dark:data-[today=true]:text-primary-900",
        "data-[selected=true]:bg-primary data-[selected=true]:text-white data-[selected=true]:shadow-md data-[selected=true]:hover:bg-primary",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-primary/12 data-[range-middle=true]:text-foreground",
        "disabled:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
};
