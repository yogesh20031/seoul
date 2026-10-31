"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { DatePicker } from "@/components/ui/DatePicker";
import { Field } from "@/components/ui/Field";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSeoulWeather } from "@/hooks/useSeoulWeather";
import type { SeoulWeather } from "@/lib/weather-schema";
import { WeatherCard } from "./WeatherCard";

type WeatherPickerProps = {
  /** Today's weather, fetched on the server so the card is filled on first paint. */
  initial: SeoulWeather | null;
  today: string;
  maxDate: string;
};

export const WeatherPicker = ({
  initial,
  today,
  maxDate,
}: WeatherPickerProps) => {
  const t = useTranslations("Weather");
  const [date, setDate] = useState(today);
  const { state, load } = useSeoulWeather(initial);

  const pick = (next: string) => {
    setDate(next);
    void load(next);
  };

  return (
    <div className="flex flex-col gap-4">
      <Field label={t("pickDate")} htmlFor="weather-date" className="sm:w-64">
        <DatePicker
          id="weather-date"
          value={date}
          onChange={pick}
          min={today}
          max={maxDate}
          required
        />
      </Field>
      <WeatherResult state={state} />
    </div>
  );
};

type WeatherResultProps = {
  state: ReturnType<typeof useSeoulWeather>["state"];
};

const WeatherResult = ({ state }: WeatherResultProps) => {
  const t = useTranslations("Weather");
  if (state.status === "ready") return <WeatherCard weather={state.weather} />;
  if (state.status === "loading" && state.previous) {
    return <WeatherCard weather={state.previous} stale />;
  }
  if (state.status === "loading") {
    return <Skeleton className="h-80 rounded-2xl" />;
  }
  return (
    <Card>
      <p className="text-sm text-text-secondary">
        {state.status === "error" ? t("unavailable") : t("choose")}
      </p>
    </Card>
  );
};
