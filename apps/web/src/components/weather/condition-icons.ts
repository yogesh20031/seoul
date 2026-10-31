import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type { WeatherCondition } from "@/lib/weather-schema";

export const CONDITION_ICONS: Record<WeatherCondition, LucideIcon> = {
  clear: Sun,
  partlyCloudy: CloudSun,
  cloudy: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: CloudSnow,
  thunder: CloudLightning,
};

// Umbrella advice kicks in at this chance of rain (or share of rainy days), in %.
export const UMBRELLA_FROM = 40;

/** What-to-wear bucket for a day, from the average of its high and low. */
export const wearFor = (tempMax: number, tempMin: number) => {
  const mean = (tempMax + tempMin) / 2;
  if (mean <= 0) return "freezing";
  if (mean <= 9) return "cold";
  if (mean <= 16) return "cool";
  if (mean <= 23) return "mild";
  return "hot";
};
