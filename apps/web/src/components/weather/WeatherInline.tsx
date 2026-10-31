"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import type { useSeoulWeather } from "@/hooks/useSeoulWeather";
import { CONDITION_ICONS, UMBRELLA_FROM } from "./condition-icons";

type WeatherInlineProps = {
  state: ReturnType<typeof useSeoulWeather>["state"];
};

/** One-line weather for a picked date, for forms like the planner where a full card is too much. */
export const WeatherInline = ({ state }: WeatherInlineProps) => {
  const t = useTranslations("Weather");

  if (state.status === "idle") return null;
  if (state.status === "error") {
    return <p className="text-xs text-text-secondary">{t("unavailable")}</p>;
  }
  const weather = state.status === "ready" ? state.weather : state.previous;
  if (!weather) {
    return <p className="text-xs text-text-secondary">{t("loading")}</p>;
  }

  const Icon = CONDITION_ICONS[weather.condition];
  const rainy =
    weather.rainChance != null && weather.rainChance >= UMBRELLA_FROM;
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-sm transition-opacity",
        state.status === "loading" && "opacity-60",
      )}
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-1.5 font-medium">
        <Icon className="size-4 text-primary dark:text-primary-900" />
        {t(`conditions.${weather.condition}`)}
      </span>
      <span>
        {weather.tempMax}° / {weather.tempMin}°
      </span>
      {weather.rainChance != null ? (
        <span className="text-text-secondary">
          {weather.kind === "forecast" ? t("rainChance") : t("rainDays")}{" "}
          {weather.rainChance}%
        </span>
      ) : null}
      {weather.kind === "typical" ? (
        <span className="text-xs text-text-secondary">({t("typical")})</span>
      ) : null}
      {rainy ? (
        <span className="text-xs text-text-secondary">{t("umbrella")}</span>
      ) : null}
    </p>
  );
};
