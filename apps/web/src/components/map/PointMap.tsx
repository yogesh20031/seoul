"use client";

import { Marker } from "react-map-gl/maplibre";
import { BaseMap } from "./BaseMap";
import { Pin } from "./Pin";

type PointMapProps = {
  lat: number;
  lng: number;
  label: string;
  className?: string;
};

export const PointMap = ({ lat, lng, label, className }: PointMapProps) => (
  <BaseMap
    className={className}
    initialViewState={{ latitude: lat, longitude: lng, zoom: 14.5 }}
  >
    <Marker latitude={lat} longitude={lng} anchor="center">
      <Pin label={label} />
    </Marker>
  </BaseMap>
);
