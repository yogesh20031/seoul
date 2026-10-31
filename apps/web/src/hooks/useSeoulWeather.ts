"use client";

import { useRef, useState } from "react";
import { seoulWeatherSchema, type SeoulWeather } from "@/lib/weather-schema";

type WeatherState =
  | { status: "idle" }
  | { status: "loading"; previous: SeoulWeather | null }
  | { status: "ready"; weather: SeoulWeather }
  | { status: "error" };

/**
 * Seoul weather for a picked date, loaded from /api/weather. Call `load` from the date picker's
 * onChange; no effect needed. A slow answer for an older pick never overwrites a newer one.
 */
export const useSeoulWeather = (initial: SeoulWeather | null = null) => {
  const [state, setState] = useState<WeatherState>(
    initial ? { status: "ready", weather: initial } : { status: "idle" },
  );
  const latestRequest = useRef(0);

  const load = async (date: string) => {
    const request = ++latestRequest.current;
    if (!date) {
      setState({ status: "idle" });
      return;
    }
    setState((current) => ({
      status: "loading",
      previous: current.status === "ready" ? current.weather : null,
    }));
    const next = await fetchWeather(date);
    if (request !== latestRequest.current) return;
    setState(next ? { status: "ready", weather: next } : { status: "error" });
  };

  return { state, load };
};

const fetchWeather = async (date: string) => {
  try {
    const res = await fetch(`/api/weather?date=${encodeURIComponent(date)}`);
    if (!res.ok) return null;
    const parsed = seoulWeatherSchema.safeParse(await res.json());
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};
