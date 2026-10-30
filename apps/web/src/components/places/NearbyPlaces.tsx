import Image from "next/image";
import { Footprints } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { pick } from "@/lib/format";
import type { NearbyPlace } from "./nearby";

type NearbyPlacesProps = { title: string; items: NearbyPlace[] };

// Past half an hour on foot, a distance reads better than a walking time nobody will do.
const MAX_WALK_MIN = 30;

export const NearbyPlaces = ({ title, items }: NearbyPlacesProps) => {
  if (items.length === 0) return null;
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {items.map((item) => (
          <NearbyCard key={item.place.id} item={item} />
        ))}
      </div>
    </section>
  );
};

const NearbyCard = ({
  item: { place, km, walkMin },
}: {
  item: NearbyPlace;
}) => {
  const t = useTranslations("PlaceDetail");
  const tCategory = useTranslations("Planner.category");
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
            sizes="(min-width: 1024px) 20vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out-strong group-hover:scale-105"
          />
          <span className="absolute top-2 left-2 glassy-full px-2 py-0.5 text-2xs font-medium text-white">
            {tCategory(place.category)}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3">
          <h3 className="line-clamp-2 text-sm font-semibold group-hover:text-primary">
            {name}
          </h3>
          <span className="mt-auto flex items-center gap-1 pt-1 text-xs text-muted-foreground">
            <Footprints className="size-3.5" />
            {walkMin <= MAX_WALK_MIN
              ? t("walk", { minutes: walkMin })
              : t("km", { km: km.toFixed(1) })}
          </span>
        </div>
      </Card>
    </Link>
  );
};
