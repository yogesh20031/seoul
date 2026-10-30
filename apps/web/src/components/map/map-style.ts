import type { Map as MapLibreMap } from "maplibre-gl";
import {
  SEOUL_BOUNDS,
  SEOUL_CENTER,
  type Locale,
  type PlaceCategory,
} from "@seoul/shared";

// OpenFreeMap needs no API key and has no quota, which keeps the whole stack free.
const STYLES = {
  light: "https://tiles.openfreemap.org/styles/positron",
  dark: "https://tiles.openfreemap.org/styles/dark",
} as const;

export const styleFor = (theme: string | undefined) =>
  theme === "dark" ? STYLES.dark : STYLES.light;

export const SEOUL_VIEW = {
  longitude: SEOUL_CENTER.lng,
  latitude: SEOUL_CENTER.lat,
  zoom: 11.2,
} as const;

type Bounds = [west: number, south: number, east: number, north: number];

export const SEOUL_MAX_BOUNDS: Bounds = [
  SEOUL_BOUNDS.minLng - 0.1,
  SEOUL_BOUNDS.minLat - 0.08,
  SEOUL_BOUNDS.maxLng + 0.1,
  SEOUL_BOUNDS.maxLat + 0.08,
];

/** The base styles label everything in the local language; switch symbol layers to the visitor's. */
export const localizeLabels = (map: MapLibreMap, locale: Locale) => {
  for (const layer of map.getStyle().layers) {
    if (
      layer.type !== "symbol" ||
      !map.getLayoutProperty(layer.id, "text-field")
    )
      continue;
    map.setLayoutProperty(layer.id, "text-field", [
      "coalesce",
      ["get", `name:${locale}`],
      ["get", "name"],
    ]);
  }
};

export const PIN_TONE: Record<PlaceCategory, string> = {
  ATTRACTION: "bg-primary",
  RESTAURANT: "bg-kr-red",
  HOTEL: "bg-kr-blue",
};

/** Bounds that fit every point, padded so a single point still gets a sensible zoom. */
export const boundsOf = (points: { lat: number; lng: number }[]): Bounds => {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const pad = 0.004;
  return [
    Math.min(...lngs) - pad,
    Math.min(...lats) - pad,
    Math.max(...lngs) + pad,
    Math.max(...lats) + pad,
  ];
};
