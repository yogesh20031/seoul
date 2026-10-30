import Image from "next/image";
import { Clock, MapPin, TrainFront } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Place } from "@seoul/shared";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { formatDuration, pick } from "@/lib/format";

export const PlaceCard = ({ place }: { place: Place }) => {
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const name = pick(place, "name", locale);

  return (
    <Link href={`/explore/places/${place.slug}`} className="group block h-full">
      <Card
        interactive
        padding="none"
        className="flex h-full flex-col overflow-hidden"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-muted">
          <Image
            src={place.imageUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out-strong group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex flex-col">
            <h3 className="text-base font-semibold group-hover:text-primary">
              {name}
            </h3>
            {/* The other script helps people match signs and ask for directions. */}
            <span className="text-xs text-muted-foreground">
              {locale === "ko" ? place.nameEn : place.nameKo}
            </span>
          </div>
          <p className="line-clamp-2 text-sm text-text-secondary">
            {pick(place, "description", locale)}
          </p>
          <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {place.district}
            </span>
            {place.nearestStation ? (
              <span
                className="flex items-center gap-1"
                title={tCommon("nearestStation")}
              >
                <TrainFront className="size-3.5" />
                {place.nearestStation}
              </span>
            ) : null}
            <span
              className="flex items-center gap-1"
              title={tCommon("suggestedTime")}
            >
              <Clock className="size-3.5" />
              {formatDuration(place.suggestedMinutes, locale)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
