// The weather shape shared by /api/weather and the browser. zod/mini keeps the client bundle small.
import * as z from "zod/mini";

export const WEATHER_CONDITIONS = [
  "clear",
  "partlyCloudy",
  "cloudy",
  "fog",
  "drizzle",
  "rain",
  "snow",
  "thunder",
] as const;

// Open-Meteo forecasts 16 days ahead; past that we fall back to the typical weather for the date.
export const FORECAST_DAYS = 16;
export const WEATHER_MAX_DAYS_AHEAD = 365;

const condition = z.enum(WEATHER_CONDITIONS);

export const seoulWeatherSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("forecast"),
    date: z.string(),
    condition,
    tempMax: z.number(),
    tempMin: z.number(),
    /** Highest hourly chance of rain that day, in %. Open-Meteo leaves it out on some far-off days. */
    rainChance: z.nullable(z.number()),
    rainMm: z.number(),
    windKmh: z.number(),
    uvIndex: z.nullable(z.number()),
    /** Seoul local time, HH:mm. */
    sunrise: z.string(),
    sunset: z.string(),
  }),
  z.object({
    kind: z.literal("typical"),
    date: z.string(),
    condition,
    tempMax: z.number(),
    tempMin: z.number(),
    /** Share of past days around this date with at least 1 mm of rain, in %. */
    rainChance: z.number(),
    rainMm: z.number(),
    /** How many past years the averages come from. */
    years: z.number(),
  }),
]);

export type SeoulWeather = z.infer<typeof seoulWeatherSchema>;
export type WeatherCondition = (typeof WEATHER_CONDITIONS)[number];
