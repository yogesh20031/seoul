import Image from "next/image";
import { Flame } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Dish } from "@seoul/shared";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { cn } from "@/lib/cn";
import { formatKrw, pick } from "@/lib/format";

// Keys of Food.spiceLevels; the API guarantees 0–3.
const SPICE_KEYS = ["0", "1", "2", "3"] as const;
const MAX_SPICE = 3;

export const DishCard = ({ dish }: { dish: Dish }) => {
  const t = useTranslations("Food");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const name = pick(dish, "name", locale);
  const spice =
    SPICE_KEYS[Math.min(MAX_SPICE, Math.max(0, dish.spiceLevel))] ?? "0";

  return (
    <Card padding="none" className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-muted">
        <Image
          src={dish.imageUrl}
          alt={name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <PhotoCredit
          credit={dish.imageCredit}
          className="absolute right-2 bottom-2 max-w-[90%] truncate rounded-full bg-black/45 px-2 py-0.5 text-white! backdrop-blur-sm"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{name}</h3>
            <span className="text-sm text-muted-foreground">
              {locale === "ko" ? dish.nameEn : dish.nameKo}
            </span>
          </div>
          <span className="text-sm font-semibold whitespace-nowrap">
            <span className="mr-1 text-xs font-normal text-muted-foreground">
              {tCommon("from")}
            </span>
            {formatKrw(dish.priceFrom, locale)}
          </span>
        </div>
        <p className="text-sm text-text-secondary">
          {pick(dish, "description", locale)}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>{t("spice")}</span>
          <span className="flex" aria-label={t(`spiceLevels.${spice}`)}>
            {Array.from({ length: MAX_SPICE }, (_, i) => (
              <Flame
                key={i}
                className={cn(
                  "size-3.5",
                  i < dish.spiceLevel
                    ? "fill-kr-red text-kr-red"
                    : "text-border",
                )}
              />
            ))}
          </span>
          <span>{t(`spiceLevels.${spice}`)}</span>
        </div>
        {dish.whereToEat.length > 0 ? (
          <div className="mt-auto flex flex-col gap-1.5 border-t border-border/60 pt-3">
            <span className="text-xs font-medium text-muted-foreground">
              {t("whereToEat")}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {dish.whereToEat.map((place) => (
                <Link
                  key={place.id}
                  href={`/explore/places/${place.slug}`}
                  className="glassy-full px-3 py-1 text-xs font-medium transition-colors hover:text-primary"
                >
                  {pick(place, "name", locale)}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
};
