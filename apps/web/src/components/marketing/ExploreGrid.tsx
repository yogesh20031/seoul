import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EXPLORE_ITEMS } from "@/components/layout/nav-items";
import { CITY_PHOTOS, type CityPhotoKey } from "@/lib/city-photos";
import { cn } from "@/lib/cn";

const IMAGES: Record<(typeof EXPLORE_ITEMS)[number]["label"], CityPhotoKey> = {
  places: "gyeongbokgung",
  food: "gwangjang",
  hotels: "bukchon",
  transport: "hanRiverNight",
};

// Bento layout: tall tiles on the outside, short ones in the middle.
const SPANS = ["lg:row-span-2", "", "", "lg:row-span-2"] as const;

export const ExploreGrid = () => {
  const t = useTranslations("Landing");
  const tNav = useTranslations("Nav");
  const locale = useLocale();

  return (
    <Reveal className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeader
          title={t("exploreTitle")}
          subtitle={t("exploreSubtitle")}
        />
        <div className="grid auto-rows-[14rem] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPLORE_ITEMS.map(({ href, label, icon: Icon }, index) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative isolate overflow-hidden rounded-3xl",
                SPANS[index],
                index === 3 && "lg:col-start-3 lg:row-start-1",
              )}
            >
              <Image
                src={CITY_PHOTOS[IMAGES[label]].src}
                alt={CITY_PHOTOS[IMAGES[label]].alt[locale]}
                title={CITY_PHOTOS[IMAGES[label]].credit}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="-z-10 object-cover transition-transform duration-700 ease-out-strong group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
              <div className="flex h-full flex-col justify-end gap-2 p-6 text-white">
                <span className="flex size-10 items-center justify-center glassy-full text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="flex items-center gap-1 text-xl font-semibold">
                  {tNav(label)}
                  <ArrowUpRight className="size-5 opacity-0 transition-opacity group-hover:opacity-100" />
                </h3>
                <p className="max-w-xs text-sm text-white/80">
                  {t(`explore.${label}`)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Reveal>
  );
};
