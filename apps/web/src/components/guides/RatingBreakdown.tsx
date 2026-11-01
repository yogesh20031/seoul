import { useTranslations } from "next-intl";
import type { GuideDetail } from "@seoul/shared";
import { Stars } from "@/components/ui/Stars";

type RatingBreakdownProps = Pick<
  GuideDetail,
  "name" | "ratingAvg" | "ratingCount" | "ratingBreakdown"
>;

type BreakdownRowProps = { stars: number; count: number; total: number };

export const RatingBreakdown = ({
  name,
  ratingAvg,
  ratingCount,
  ratingBreakdown,
}: RatingBreakdownProps) => {
  const t = useTranslations("Guides");
  const tCommon = useTranslations("Common");
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border p-5">
      <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-8">
        <div className="flex flex-col items-center gap-1.5 sm:px-2">
          <span className="text-4xl font-semibold tracking-tight">
            {ratingAvg.toFixed(1)}
          </span>
          {/* Rounded so a 4.6 shows five stars, matching how the score reads at a glance. */}
          <Stars value={Math.round(ratingAvg)} />
          <span className="text-xs text-muted-foreground">
            {tCommon("reviews", { count: ratingCount })}
          </span>
        </div>
        <ul className="flex flex-col gap-2">
          {ratingBreakdown.map((row) => (
            <BreakdownRow key={row.stars} {...row} total={ratingCount} />
          ))}
        </ul>
      </div>
      <p className="text-xs text-muted-foreground">
        {t("ratingNote", { name })}
      </p>
    </div>
  );
};

// <progress> draws the bar from value/max, so the width needs no inline style.
const BreakdownRow = ({ stars, count, total }: BreakdownRowProps) => {
  const t = useTranslations("Guides");
  return (
    <li className="flex items-center gap-3 text-sm">
      <span className="w-8 shrink-0 text-muted-foreground tabular-nums">
        {stars}★
      </span>
      <progress
        value={count}
        max={Math.max(total, 1)}
        aria-label={t("starsShare", { stars, count })}
        className="h-2 flex-1 appearance-none overflow-hidden rounded-full bg-muted [&::-moz-progress-bar]:bg-amber-400 [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-amber-400"
      />
      <span className="w-8 shrink-0 text-right text-muted-foreground tabular-nums">
        {count}
      </span>
    </li>
  );
};
