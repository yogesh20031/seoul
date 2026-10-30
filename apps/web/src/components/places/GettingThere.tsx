import { ArrowUpRight, Navigation, TrainFront } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card } from "@/components/ui/Card";

type GettingThereProps = {
  nameKo: string;
  lat: number;
  lng: number;
  station: string | null;
};

const TRANSPORT_GUIDE = "/explore/transport/subway";

/** Station plus one-tap directions. Kakao first, because Google can't route on foot in Korea. */
export const GettingThere = ({
  nameKo,
  lat,
  lng,
  station,
}: GettingThereProps) => {
  const t = useTranslations("PlaceDetail");
  // Kakao's link format is name,lat,lng; the Korean name matches what Kakao itself shows.
  const kakao = `https://map.kakao.com/link/to/${encodeURIComponent(nameKo)},${lat},${lng}`;
  const google = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <Card className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <Navigation className="size-4 text-primary" />
        {t("gettingThere")}
      </h2>
      {station ? (
        <div className="flex gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
            <TrainFront className="size-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              {t("station")}
            </span>
            <span className="text-sm font-medium">{station}</span>
          </div>
        </div>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <a
          href={kakao}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ size: "sm" })}
        >
          {t("kakaoDirections")}
          <ArrowUpRight />
        </a>
        <a
          href={google}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "secondary", size: "sm" })}
        >
          {t("googleMaps")}
          <ArrowUpRight />
        </a>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {t("mapsTip")}
      </p>
      <Link
        href={TRANSPORT_GUIDE}
        className="text-xs font-medium text-primary hover:underline"
      >
        {t("transportGuide")} →
      </Link>
    </Card>
  );
};
