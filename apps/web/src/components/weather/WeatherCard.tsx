import type { ReactNode } from "react";
import {
  Droplets,
  Shirt,
  Sunrise,
  Sunset,
  SunMedium,
  Umbrella,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";
import type { SeoulWeather } from "@/lib/weather-schema";
import { CONDITION_ICONS, UMBRELLA_FROM, wearFor } from "./condition-icons";

type WeatherCardProps = {
  weather: SeoulWeather;
  /** Dims the card while a newer date is loading, instead of flashing a skeleton. */
  stale?: boolean;
};

const OPEN_METEO_URL = "https://open-meteo.com/";

export const WeatherCard = ({ weather, stale = false }: WeatherCardProps) => {
  const t = useTranslations("Weather");
  const locale = useLocale();
  const Icon = CONDITION_ICONS[weather.condition];
  const rainChance = weather.rainChance;

  return (
    <Card
      className={cn(
        "flex flex-col gap-6 transition-opacity",
        stale && "opacity-60",
      )}
      aria-busy={stale}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-primary-900">
            <Icon className="size-7" />
          </span>
          <div className="flex flex-col">
            <p className="text-lg font-semibold">
              {t(`conditions.${weather.condition}`)}
            </p>
            <p className="text-sm text-text-secondary">
              {formatDate(weather.date, locale)}
            </p>
          </div>
        </div>
        {weather.kind === "forecast" ? (
          <Badge tone="primary">{t("forecast")}</Badge>
        ) : (
          <Badge>{t("typical")}</Badge>
        )}
      </div>

      <div className="flex items-end gap-3">
        <p className="text-5xl font-semibold tracking-tight">
          {weather.tempMax}°
        </p>
        <p className="pb-1 text-2xl text-text-secondary">{weather.tempMin}°</p>
        <p className="pb-2 text-xs text-text-secondary">
          {t("high")} / {t("low")}
        </p>
      </div>

      <dl
        className={cn(
          "grid grid-cols-2 gap-3",
          weather.kind === "forecast" && "sm:grid-cols-4",
        )}
      >
        <Stat
          icon={Umbrella}
          label={weather.kind === "forecast" ? t("rainChance") : t("rainDays")}
          value={rainChance == null ? "–" : `${rainChance}%`}
        />
        <Stat
          icon={Droplets}
          label={t("rainAmount")}
          value={t("units.mm", { value: weather.rainMm })}
        />
        {weather.kind === "forecast" ? (
          <>
            <Stat
              icon={Wind}
              label={t("wind")}
              value={t("units.kmh", { value: weather.windKmh })}
            />
            <Stat
              icon={SunMedium}
              label={t("uv")}
              value={weather.uvIndex == null ? "–" : String(weather.uvIndex)}
            />
          </>
        ) : null}
      </dl>

      {weather.kind === "forecast" ? (
        <p className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-text-secondary">
          <span className="inline-flex items-center gap-2">
            <Sunrise className="size-4" />
            {t("sunrise")} {weather.sunrise}
          </span>
          <span className="inline-flex items-center gap-2">
            <Sunset className="size-4" />
            {t("sunset")} {weather.sunset}
          </span>
        </p>
      ) : (
        <p className="text-sm text-text-secondary">
          {t("typicalNote", { years: weather.years })}
        </p>
      )}

      <p className="flex items-start gap-3 rounded-xl bg-primary/8 px-4 py-3 text-sm">
        <Shirt className="mt-0.5 size-4 shrink-0 text-primary dark:text-primary-900" />
        <span>
          {t(`wear.${wearFor(weather.tempMax, weather.tempMin)}`)}
          {rainChance != null && rainChance >= UMBRELLA_FROM
            ? ` ${t("umbrella")}`
            : null}
        </span>
      </p>

      <p className="text-2xs text-text-secondary">
        <a
          href={OPEN_METEO_URL}
          target="_blank"
          rel="noreferrer"
          className="underline-offset-2 hover:underline"
        >
          {t("credit")}
        </a>
      </p>
    </Card>
  );
};

type StatProps = { icon: LucideIcon; label: string; value: ReactNode };

const Stat = ({ icon: Icon, label, value }: StatProps) => (
  <div className="flex flex-col gap-1 rounded-xl bg-foreground/4 px-3 py-2.5">
    <dt className="flex items-center gap-1.5 text-xs text-text-secondary">
      <Icon className="size-3.5" />
      {label}
    </dt>
    <dd className="text-base font-semibold">{value}</dd>
  </div>
);
