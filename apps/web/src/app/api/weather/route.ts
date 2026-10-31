import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { seoulToday } from "@/lib/format";
import { getSeoulWeather, WeatherUnavailableError } from "@/lib/weather";
import { WEATHER_MAX_DAYS_AHEAD } from "@/lib/weather-schema";

const DAY_MS = 24 * 60 * 60 * 1000;

// Public, read-only data with no user involved, so there's nothing to auth-check; the date is still validated.
const querySchema = z.object({
  date: z.iso.date(),
});

export const GET = async (request: NextRequest) => {
  const parsed = querySchema.safeParse({
    date: request.nextUrl.searchParams.get("date"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_DATE" }, { status: 400 });
  }
  const { date } = parsed.data;
  const daysAhead = Math.round(
    (Date.parse(date) - Date.parse(seoulToday())) / DAY_MS,
  );
  if (daysAhead < 0 || daysAhead > WEATHER_MAX_DAYS_AHEAD) {
    return NextResponse.json({ error: "DATE_OUT_OF_RANGE" }, { status: 400 });
  }

  try {
    const weather = await getSeoulWeather(date);
    return NextResponse.json(weather, {
      // Vercel's CDN can answer repeat requests for the same date without running this again.
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    if (error instanceof WeatherUnavailableError) {
      return NextResponse.json(
        { error: "WEATHER_UNAVAILABLE" },
        { status: 502 },
      );
    }
    throw error;
  }
};
