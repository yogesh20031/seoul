"use client";

import { useLocale } from "next-intl";
import { Layer, Marker, Source } from "react-map-gl/maplibre";
import type { PlaceSummary } from "@seoul/shared";
import { pick } from "@/lib/format";
import { BaseMap } from "./BaseMap";
import { boundsOf, PIN_TONE } from "./map-style";
import { Pin } from "./Pin";

type RouteMapProps = { stops: PlaceSummary[]; className?: string };

const LINE_PAINT = {
  "line-color": "#6c63ff",
  "line-width": 4,
  "line-opacity": 0.8,
  "line-dasharray": [1.5, 1.5],
};

export const RouteMap = ({ stops, className }: RouteMapProps) => {
  const locale = useLocale();
  if (stops.length === 0) return null;
  const line = {
    type: "Feature" as const,
    properties: {},
    geometry: {
      type: "LineString" as const,
      coordinates: stops.map((s) => [s.lng, s.lat]),
    },
  };

  return (
    <BaseMap
      // Remount when the route changes so the view re-fits the new stops.
      key={stops.map((s) => s.id).join()}
      className={className}
      initialViewState={{
        bounds: boundsOf(stops),
        fitBoundsOptions: { padding: 56 },
      }}
    >
      <Source id="route" type="geojson" data={line}>
        <Layer
          id="route-line"
          type="line"
          paint={LINE_PAINT}
          layout={{ "line-cap": "round", "line-join": "round" }}
        />
      </Source>
      {stops.map((stop, index) => (
        <Marker key={stop.id} latitude={stop.lat} longitude={stop.lng}>
          <Pin
            tone={PIN_TONE[stop.category]}
            label={pick(stop, "name", locale)}
          >
            {index + 1}
          </Pin>
        </Marker>
      ))}
    </BaseMap>
  );
};
