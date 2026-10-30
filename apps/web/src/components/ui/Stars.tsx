import { Star } from "lucide-react";

const STAR_SLOTS = [1, 2, 3, 4, 5] as const;

export const Stars = ({ value }: { value: number }) => (
  <span className="inline-flex gap-0.5" aria-label={`${value} / 5`}>
    {STAR_SLOTS.map((slot) => (
      <Star
        key={slot}
        aria-hidden
        className={
          slot <= value
            ? "size-3.5 fill-amber-400 text-amber-400"
            : "size-3.5 text-muted-foreground/40"
        }
      />
    ))}
  </span>
);
