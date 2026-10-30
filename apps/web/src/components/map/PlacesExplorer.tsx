"use client";

import { useState } from "react";
import { Check, Plus, Route, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Marker, Popup } from "react-map-gl/maplibre";
import {
  PLACE_CATEGORIES,
  type PlaceCategory,
  type PlaceSummary,
} from "@seoul/shared";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { cn } from "@/lib/cn";
import { pick } from "@/lib/format";
import { BaseMap } from "./BaseMap";
import { PIN_TONE } from "./map-style";
import { Pin } from "./Pin";

const MAX_PLAN_STOPS = 10;

export const PlacesExplorer = ({ places }: { places: PlaceSummary[] }) => {
  const t = useTranslations("Map");
  const tCategory = useTranslations("Planner.category");
  const locale = useLocale();
  const [shown, setShown] = useState<PlaceCategory[]>([...PLACE_CATEGORIES]);
  const [selected, setSelected] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = places.filter((place) => shown.includes(place.category));
  const open = visible.find((place) => place.id === openId) ?? null;

  const toggleCategory = (category: PlaceCategory) =>
    setShown((current) =>
      current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category],
    );

  const toggleSelected = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((s) => s !== id)
        : current.length < MAX_PLAN_STOPS
          ? [...current, id]
          : current,
    );

  return (
    <div className="relative">
      <BaseMap
        className="h-[calc(100svh-12rem)] min-h-[28rem]"
        onClick={() => setOpenId(null)}
      >
        {visible.map((place) => (
          <Marker
            key={place.id}
            latitude={place.lat}
            longitude={place.lng}
            onClick={(event) => {
              // Otherwise the map's own click handler closes the popup we're opening.
              event.originalEvent.stopPropagation();
              setOpenId(place.id);
            }}
          >
            <button type="button" className="cursor-pointer">
              <Pin
                tone={PIN_TONE[place.category]}
                active={selected.includes(place.id)}
                label={pick(place, "name", locale)}
              >
                {selected.includes(place.id)
                  ? selected.indexOf(place.id) + 1
                  : null}
              </Pin>
            </button>
          </Marker>
        ))}

        {open ? (
          <Popup
            latitude={open.lat}
            longitude={open.lng}
            offset={18}
            closeButton={false}
            onClose={() => setOpenId(null)}
            maxWidth="260px"
          >
            <div className="flex flex-col gap-2 p-1">
              <span className="text-2xs font-semibold tracking-wide text-primary uppercase">
                {tCategory(open.category)}
              </span>
              <Link
                href={`/explore/places/${open.slug}`}
                className="text-sm font-semibold hover:text-primary"
              >
                {pick(open, "name", locale)}
              </Link>
              <span className="text-xs text-muted-foreground">
                {open.district}
              </span>
              <Button
                size="sm"
                variant={selected.includes(open.id) ? "secondary" : "primary"}
                onClick={() => toggleSelected(open.id)}
              >
                {selected.includes(open.id) ? <Check /> : <Plus />}
                {selected.includes(open.id) ? t("selected") : t("select")}
              </Button>
            </div>
          </Popup>
        ) : null}
      </BaseMap>

      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1 glassy-full p-1">
        <span className="px-2 text-xs font-medium text-muted-foreground">
          {t("layers")}
        </span>
        {PLACE_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={shown.includes(category)}
            onClick={() => toggleCategory(category)}
            className={cn(
              "flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors",
              shown.includes(category)
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className={cn("size-2.5 rounded-full", PIN_TONE[category])} />
            {tCategory(category)}
          </button>
        ))}
      </div>

      {selected.length > 0 ? (
        <div className="absolute inset-x-3 bottom-4 mx-auto flex max-w-md items-center justify-between gap-2 glassy-full p-1.5 pl-4">
          <span className="text-sm font-medium tabular-nums">
            {selected.length} / {MAX_PLAN_STOPS}
          </span>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
              <X />
              {t("clearSelection")}
            </Button>
            {selected.length >= 2 ? (
              <ButtonLink
                size="sm"
                href={`/planner?places=${selected.join(",")}`}
              >
                <Route />
                {t("planWith", { count: selected.length })}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};
