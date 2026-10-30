"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { Marker } from "react-map-gl/maplibre";
import { SEOUL_CENTER } from "@seoul/shared";
import { BaseMap } from "./BaseMap";
import { Pin } from "./Pin";

type PinPickerProps = {
  latName: string;
  lngName: string;
  initial?: { lat: number; lng: number } | null;
  hint: string;
  className?: string;
};

// Coordinates go out as hidden inputs so the picker works inside a plain Server Action form.
const round = (n: number) => Math.round(n * 1e6) / 1e6;

export const PinPicker = ({
  latName,
  lngName,
  initial,
  hint,
  className,
}: PinPickerProps) => {
  const [point, setPoint] = useState(initial ?? null);
  const view = point ?? SEOUL_CENTER;

  return (
    <div className="flex flex-col gap-2">
      <BaseMap
        className={className}
        initialViewState={{
          latitude: view.lat,
          longitude: view.lng,
          zoom: point ? 14 : 11.5,
        }}
        cursor="crosshair"
        onClick={(event) =>
          setPoint({
            lat: round(event.lngLat.lat),
            lng: round(event.lngLat.lng),
          })
        }
      >
        {point ? (
          <Marker
            latitude={point.lat}
            longitude={point.lng}
            draggable
            onDragEnd={(event) =>
              setPoint({
                lat: round(event.lngLat.lat),
                lng: round(event.lngLat.lng),
              })
            }
          >
            <Pin label={hint} />
          </Marker>
        ) : null}
      </BaseMap>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="size-3.5" />
        {point ? `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}` : hint}
      </p>
      <input type="hidden" name={latName} value={point?.lat ?? ""} />
      <input type="hidden" name={lngName} value={point?.lng ?? ""} />
    </div>
  );
};
