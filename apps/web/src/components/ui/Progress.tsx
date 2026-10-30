import { cn } from "@/lib/cn";

type ProgressProps = {
  value: number;
  max: number;
  label: string;
  className?: string;
};

// Native <progress> keeps the data-driven width out of inline styles and is announced by screen readers.
export const Progress = ({ value, max, label, className }: ProgressProps) => (
  <progress
    value={value}
    max={max}
    aria-label={label}
    className={cn(
      "h-1.5 w-full appearance-none overflow-hidden rounded-full bg-muted",
      "[&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary",
      className,
    )}
  />
);
