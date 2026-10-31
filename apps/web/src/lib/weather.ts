import "server-only";
import { z } from "zod";
import { seoulToday } from "@/lib/format";
import {
  FORECAST_DAYS,
  type SeoulWeather,
  type WeatherCondition,
} from "@/lib/weather-schema";

// Open-Meteo: free, no API key, CC BY 4.0 (credited under the weather card).
// https://open-meteo.com/en/docs and https://open-meteo.com/en/docs/historical-weather-api
const SEOUL = { latitude: 37.5665, longitude: 126.978 };
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";
const HISTORY_YEARS = 10;
// Days either side of the date that count towards "typical", so one odd year doesn't dominate.
const TYPICAL_WINDOW_DAYS = 3;
const RAINY_DAY_MM = 1;

const nullableNumbers = z.array(z.number().nullable());

const forecastResponse = z.object({
  daily: z.object({
    time: z.array(z.string()),
    weather_code: nullableNumbers,
    temperature_2m_max: nullableNumbers,
    temperature_2m_min: nullableNumbers,
    precipitation_probability_max: nullableNumbers,
    precipitation_sum: nullableNumbers,
    wind_speed_10m_max: nullableNumbers,
    uv_index_max: nullableNumbers,
    sunrise: z.array(z.string()),
    sunset: z.array(z.string()),
  }),
});

const archiveResponse = z.object({
  daily: z.object({
    time: z.array(z.string()),
    weather_code: nullableNumbers,
    temperature_2m_max: nullableNumbers,
    temperature_2m_min: nullableNumbers,
    precipitation_sum: nullableNumbers,
  }),
});

export class WeatherUnavailableError extends Error {}

/** Forecast for dates Open-Meteo covers, otherwise the typical weather for that date from past years. */
export const getSeoulWeather = async (date: string): Promise<SeoulWeather> => {
  const daysAhead = daysBetween(seoulToday(), date);
  return daysAhead < FORECAST_DAYS ? getForecast(date) : getTypical(date);
};

const getForecast = async (date: string): Promise<SeoulWeather> => {
  const { daily } = await fetchJson(
    FORECAST_URL,
    {
      daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_probability_max",
        "precipitation_sum",
        "wind_speed_10m_max",
        "uv_index_max",
        "sunrise",
        "sunset",
      ].join(","),
      forecast_days: String(FORECAST_DAYS),
    },
    forecastResponse,
    // One cached response covers all 16 days, refreshed every 30 minutes.
    30 * 60,
  );
  const i = daily.time.indexOf(date);
  const tempMax = daily.temperature_2m_max[i];
  const tempMin = daily.temperature_2m_min[i];
  if (i === -1 || tempMax == null || tempMin == null) {
    throw new WeatherUnavailableError(`No forecast for ${date}`);
  }
  return {
    kind: "forecast",
    date,
    condition: conditionFor(daily.weather_code[i] ?? 0),
    tempMax: Math.round(tempMax),
    tempMin: Math.round(tempMin),
    rainChance: daily.precipitation_probability_max[i] ?? null,
    rainMm: roundTo(daily.precipitation_sum[i] ?? 0, 1),
    windKmh: Math.round(daily.wind_speed_10m_max[i] ?? 0),
    uvIndex: roundOrNull(daily.uv_index_max[i]),
    sunrise: clockTime(daily.sunrise[i]),
    sunset: clockTime(daily.sunset[i]),
  };
};

const getTypical = async (date: string): Promise<SeoulWeather> => {
  // Whole past years, so the URL (and the cached response) only changes once a year.
  const lastYear = Number(seoulToday().slice(0, 4)) - 1;
  const { daily } = await fetchJson(
    ARCHIVE_URL,
    {
      start_date: `${lastYear - HISTORY_YEARS + 1}-01-01`,
      end_date: `${lastYear}-12-31`,
      daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_sum",
      ].join(","),
    },
    archiveResponse,
    30 * 24 * 60 * 60,
  );

  const indexByDay = new Map(daily.time.map((day, i) => [day, i]));
  const [, month, day] = date.split("-").map(Number);
  const maxes: number[] = [];
  const mins: number[] = [];
  const rain: number[] = [];
  const conditions: WeatherCondition[] = [];
  for (let year = lastYear - HISTORY_YEARS + 1; year <= lastYear; year++) {
    const center = sameDayIn(year, month ?? 1, day ?? 1);
    for (
      let offset = -TYPICAL_WINDOW_DAYS;
      offset <= TYPICAL_WINDOW_DAYS;
      offset++
    ) {
      const i = indexByDay.get(isoDay(center + offset * DAY_MS));
      if (i === undefined) continue;
      const max = daily.temperature_2m_max[i];
      const min = daily.temperature_2m_min[i];
      if (max == null || min == null) continue;
      maxes.push(max);
      mins.push(min);
      rain.push(daily.precipitation_sum[i] ?? 0);
      conditions.push(conditionFor(daily.weather_code[i] ?? 0));
    }
  }
  if (maxes.length === 0) {
    throw new WeatherUnavailableError(`No history around ${date}`);
  }
  return {
    kind: "typical",
    date,
    condition: mostCommon(conditions),
    tempMax: Math.round(average(maxes)),
    tempMin: Math.round(average(mins)),
    rainChance: Math.round(
      (rain.filter((mm) => mm >= RAINY_DAY_MM).length / rain.length) * 100,
    ),
    rainMm: roundTo(average(rain), 1),
    years: HISTORY_YEARS,
  };
};

const fetchJson = async <T>(
  url: string,
  params: Record<string, string>,
  schema: z.ZodType<T>,
  revalidate: number,
) => {
  const query = new URLSearchParams({
    latitude: String(SEOUL.latitude),
    longitude: String(SEOUL.longitude),
    timezone: "Asia/Seoul",
    ...params,
  });
  const res = await fetch(`${url}?${query}`, { next: { revalidate } });
  if (!res.ok) {
    throw new WeatherUnavailableError(`Open-Meteo answered ${res.status}`);
  }
  const parsed = schema.safeParse(await res.json());
  if (!parsed.success) {
    throw new WeatherUnavailableError("Unexpected Open-Meteo response");
  }
  return parsed.data;
};

// WMO weather interpretation codes, as listed in the Open-Meteo docs.
const conditionFor = (code: number): WeatherCondition => {
  if (code === 0 || code === 1) return "clear";
  if (code === 2) return "partlyCloudy";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 95) return "thunder";
  return "cloudy";
};

const DAY_MS = 24 * 60 * 60 * 1000;

const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(to) - Date.parse(from)) / DAY_MS);

/** The same month and day in another year, as a UTC timestamp; 29 Feb becomes 28 Feb in common years. */
const sameDayIn = (year: number, month: number, day: number) => {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Date.UTC(year, month - 1, Math.min(day, daysInMonth));
};

const isoDay = (timestamp: number) =>
  new Date(timestamp).toISOString().slice(0, 10);

/** "2026-10-31T06:52" → "06:52". Open-Meteo already returns Seoul time because we pass the timezone. */
const clockTime = (isoLocal: string | undefined) =>
  isoLocal?.slice(11, 16) ?? "";

const average = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

const roundTo = (value: number, digits: number) =>
  Math.round(value * 10 ** digits) / 10 ** digits;

const roundOrNull = (value: number | null | undefined) =>
  value == null ? null : Math.round(value);

const mostCommon = (values: WeatherCondition[]) => {
  const counts = new Map<WeatherCondition, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].reduce((best, entry) =>
    entry[1] > best[1] ? entry : best,
  )[0];
};
