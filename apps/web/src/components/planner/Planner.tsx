"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, Route, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ItineraryPlan, PlaceSummary } from "@seoul/shared";
import { planAction } from "@/actions/itineraries";
import { LazyRouteMap } from "@/components/map/lazy";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { TimePicker } from "@/components/ui/TimePicker";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { pick } from "@/lib/format";
import { PlanTimeline } from "./PlanTimeline";
import { SavePlanForm } from "./SavePlanForm";

type PlannerProps = {
  places: PlaceSummary[];
  initialSelected: string[];
  canSave: boolean;
};

const MIN_STOPS = 2;
const MAX_STOPS = 10;
const SEARCH_LIMIT = 40;
const CATEGORY_DOT: Record<PlaceSummary["category"], string> = {
  ATTRACTION: "bg-primary",
  RESTAURANT: "bg-kr-red",
  HOTEL: "bg-kr-blue",
};

// A plan is only valid for the exact stops and start time it was computed from.
const planKey = (ids: string[], startTime: string) =>
  `${[...ids].sort().join(",")}@${startTime}`;

export const Planner = ({ places, initialSelected, canSave }: PlannerProps) => {
  const t = useTranslations("Planner");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(initialSelected.slice(0, MAX_STOPS));
  const [startTime, setStartTime] = useState("09:00");
  const [result, setResult] = useState<{
    key: string;
    plan: ItineraryPlan;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const byId = new Map(places.map((place) => [place.id, place]));
  const selectedPlaces = selected.flatMap((id) => byId.get(id) ?? []);
  const needle = query.trim().toLowerCase();
  const matches = places
    .filter((place) => !selected.includes(place.id))
    .filter(
      (place) =>
        !needle ||
        place.nameEn.toLowerCase().includes(needle) ||
        place.nameKo.toLowerCase().includes(needle) ||
        place.district.toLowerCase().includes(needle),
    )
    .slice(0, SEARCH_LIMIT);
  // Editing the stops after planning hides the old route instead of showing a stale one.
  const plan =
    result && result.key === planKey(selected, startTime) ? result.plan : null;

  const add = (id: string) =>
    setSelected((current) =>
      current.length < MAX_STOPS ? [...current, id] : current,
    );
  const remove = (id: string) =>
    setSelected((current) => current.filter((s) => s !== id));

  const order = () => {
    setError(null);
    const key = planKey(selected, startTime);
    startTransition(async () => {
      const response = await planAction({ placeIds: selected, startTime });
      if (response.ok) setResult({ key, plan: response.plan });
      else setError(response.message);
    });
  };

  return (
    // minmax(0, …) tracks: plain grid columns grow to fit the longest place name, which pushed
    // the cards off the screen on narrow phones.
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col gap-4">
        <Card className="flex flex-col gap-4">
          <h2 className="text-base font-semibold">{t("yourStops")}</h2>
          {selectedPlaces.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noStops")}</p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {selectedPlaces.map((place) => (
                <li
                  key={place.id}
                  className="flex items-center gap-2 glassy-md py-2 pr-1.5 pl-3"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {pick(place, "name", locale)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => remove(place.id)}
                    aria-label={t("remove")}
                  >
                    <X />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <Field label={t("startTime")} htmlFor="start-time">
            <TimePicker
              id="start-time"
              value={startTime}
              onChange={setStartTime}
            />
          </Field>
          {error ? <FormMessage tone="error">{error}</FormMessage> : null}
          <Button
            size="lg"
            disabled={selected.length < MIN_STOPS || pending}
            onClick={order}
          >
            {pending ? <Loader2 className="animate-spin" /> : <Route />}
            {pending ? t("ordering") : t("order")}
          </Button>
          {selected.length >= MAX_STOPS ? (
            <p className="text-xs text-muted-foreground">{t("maxStops")}</p>
          ) : null}
        </Card>

        <Card className="flex flex-col gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="pl-10"
              aria-label={t("searchPlaceholder")}
            />
          </div>
          <ul className="flex max-h-96 flex-col gap-1 overflow-y-auto pr-1">
            {matches.map((place) => (
              <li key={place.id}>
                <button
                  type="button"
                  onClick={() => add(place.id)}
                  disabled={selected.length >= MAX_STOPS}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-card-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      CATEGORY_DOT[place.category],
                    )}
                  />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm">
                      {pick(place, "name", locale)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t(`category.${place.category}`)} · {place.district}
                    </span>
                  </span>
                  <Plus className="size-4 text-primary" aria-label={t("add")} />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        {plan ? (
          <>
            <LazyRouteMap
              stops={plan.stops.map((stop) => stop.place)}
              className="h-80 lg:h-96"
            />
            <Card className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold">{t("resultTitle")}</h2>
              <PlanTimeline plan={plan} />
            </Card>
            <SavePlanForm
              placeIds={selected}
              startTime={startTime}
              canSave={canSave}
            />
          </>
        ) : selectedPlaces.length > 0 ? (
          <LazyRouteMap stops={selectedPlaces} className="h-80 lg:h-[32rem]" />
        ) : (
          <Card className="flex h-80 flex-col items-center justify-center gap-3 text-center lg:h-[32rem]">
            <Route className="size-10 text-primary/60" />
            <p className="max-w-xs text-sm text-muted-foreground">
              {t("noStops")}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
