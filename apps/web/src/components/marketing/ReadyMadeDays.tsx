import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CITY_PHOTOS, type CityPhotoKey } from "@/lib/city-photos";

type ReadyDay = {
  key: "classic" | "food" | "kculture";
  photo: CityPhotoKey;
  /** Seed place slugs, in a sensible order; the planner re-orders them by distance anyway. */
  places: string[];
};

// Itineraries by trip type, borrowed from Visit Copenhagen's "how many days" pages, but each one
// opens our own planner with the stops filled in.
const DAYS: ReadyDay[] = [
  {
    key: "classic",
    photo: "gyeongbokgung",
    places: [
      "gyeongbokgung-palace",
      "bukchon-hanok-village",
      "insadong",
      "n-seoul-tower",
    ],
  },
  {
    key: "food",
    photo: "gwangjang",
    places: [
      "tongin-market-dosirak-cafe",
      "gwangjang-market",
      "cheonggyecheon-stream",
      "myeongdong-shopping-street",
    ],
  },
  {
    key: "kculture",
    photo: "ddpNight",
    places: ["seongsu-dong", "dongdaemun-design-plaza", "hongdae-street"],
  },
];

export const ReadyMadeDays = () => {
  const t = useTranslations("Landing.readyDays");
  return (
    <Reveal className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />
        <div className="grid gap-5 md:grid-cols-3">
          {DAYS.map((day) => (
            <ReadyDayCard key={day.key} day={day} />
          ))}
        </div>
      </Container>
    </Reveal>
  );
};

const ReadyDayCard = ({ day }: { day: ReadyDay }) => {
  const t = useTranslations("Landing.readyDays");
  const locale = useLocale();
  const photo = CITY_PHOTOS[day.photo];
  const stops = t(`days.${day.key}.stops`).split(" · ");
  const href = `/planner?places=${day.places.map((slug) => `place-${slug}`).join(",")}`;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden glassy-2xl transition-transform duration-200 ease-out-strong hover:-translate-y-0.5"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={photo.src}
          alt={photo.alt[locale]}
          title={photo.credit}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out-strong group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 glassy-full px-3 py-1 text-xs font-medium">
          {t("stopsCount", { count: day.places.length })}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold">{t(`days.${day.key}.title`)}</h3>
        <p className="text-sm text-text-secondary">
          {t(`days.${day.key}.body`)}
        </p>
        <ol className="flex flex-col gap-1.5">
          {stops.map((stop) => (
            <li key={stop} className="flex items-center gap-2 text-sm">
              <MapPin className="size-3.5 shrink-0 text-primary dark:text-primary-900" />
              {stop}
            </li>
          ))}
        </ol>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary dark:text-primary-900">
          {t("open")}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
};
