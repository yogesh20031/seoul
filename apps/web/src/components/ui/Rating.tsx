import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

type RatingProps = {
  value: number;
  count?: number;
  className?: string;
};

export const Rating = ({ value, count, className }: RatingProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 text-xs font-medium",
      className,
    )}
  >
    <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
    <span>{value > 0 ? value.toFixed(1) : "New"}</span>
    {count !== undefined && count > 0 ? (
      <span className="text-muted-foreground">({count})</span>
    ) : null}
  </span>
);
