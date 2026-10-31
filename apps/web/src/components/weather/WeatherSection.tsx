import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { seoulToday } from "@/lib/format";
import { getSeoulWeather } from "@/lib/weather";
import { WEATHER_MAX_DAYS_AHEAD } from "@/lib/weather-schema";
import { WeatherPicker } from "./WeatherPicker";

const DAY_MS = 24 * 60 * 60 * 1000;
const SEASONS = ["spring", "summer", "autumn", "winter"] as const;

export const WeatherSection = async () => {
  const t = await getTranslations("Weather");
  const today = seoulToday();
  const maxDate = new Date(Date.parse(today) + WEATHER_MAX_DAYS_AHEAD * DAY_MS)
    .toISOString()
    .slice(0, 10);
  // The page still renders if Open-Meteo is down; the card then asks the visitor to pick a date.
  const initial = await getSeoulWeather(today).catch(() => null);

  return (
    <Reveal className="py-16 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        <div className="flex flex-col gap-8">
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
          />
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{t("seasonsTitle")}</h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {SEASONS.map((season) => (
                <li
                  key={season}
                  className="flex flex-col gap-1 rounded-xl border border-border px-4 py-3"
                >
                  <p className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold">
                      {t(`seasons.${season}.name`)}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {t(`seasons.${season}.months`)}
                    </span>
                  </p>
                  <p className="text-xs leading-relaxed text-text-secondary">
                    {t(`seasons.${season}.note`)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <WeatherPicker initial={initial} today={today} maxDate={maxDate} />
      </Container>
    </Reveal>
  );
};
