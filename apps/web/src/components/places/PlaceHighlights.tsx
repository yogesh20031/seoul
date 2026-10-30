import { BedDouble, Sparkles, UtensilsCrossed } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PlaceCategory } from "@seoul/shared";
import { Card } from "@/components/ui/Card";

type PlaceHighlightsProps = { category: PlaceCategory; items: string[] };

// Restaurants list dishes and hotels list reasons to stay, so the heading and icon follow the category.
const VARIANT = {
  ATTRACTION: { titleKey: "highlights", Icon: Sparkles },
  RESTAURANT: { titleKey: "highlightsRestaurant", Icon: UtensilsCrossed },
  HOTEL: { titleKey: "highlightsHotel", Icon: BedDouble },
} as const;

export const PlaceHighlights = ({ category, items }: PlaceHighlightsProps) => {
  const t = useTranslations("PlaceDetail");
  if (items.length === 0) return null;
  const { titleKey, Icon } = VARIANT[category];

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Icon className="size-5 text-primary" />
        {t(titleKey)}
      </h2>
      <ol className="grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <li
            key={item}
            className="flex gap-3 rounded-2xl bg-card/60 p-3 ring-1 ring-border/60"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-xs font-semibold text-primary tabular-nums dark:text-primary-900">
              {index + 1}
            </span>
            <span className="text-sm leading-relaxed">{item}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
};
