"use client";

import type { ComponentProps } from "react";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { Map, NavigationControl } from "react-map-gl/maplibre";
import { cn } from "@/lib/cn";
import {
  localizeLabels,
  SEOUL_MAX_BOUNDS,
  SEOUL_VIEW,
  styleFor,
} from "./map-style";

type BaseMapProps = Omit<ComponentProps<typeof Map>, "mapStyle" | "style"> & {
  className?: string;
};

/** Seoul-bounded MapLibre map that follows the site theme and language. Size it with className. */
export const BaseMap = ({
  className,
  children,
  initialViewState,
  onLoad,
  ...props
}: BaseMapProps) => {
  const locale = useLocale();
  const { resolvedTheme } = useTheme();

  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      <Map
        // A new style drops our label tweaks, so remount instead of swapping styles in place.
        key={`${resolvedTheme}-${locale}`}
        mapStyle={styleFor(resolvedTheme)}
        initialViewState={initialViewState ?? SEOUL_VIEW}
        maxBounds={SEOUL_MAX_BOUNDS}
        attributionControl={{ compact: true }}
        onLoad={(event) => {
          localizeLabels(event.target, locale);
          // MapLibre opens the compact credit on load and only folds it after the first drag; on a
          // phone it covers the bottom of the map, so start folded. The (i) button still opens it.
          event.target
            .getContainer()
            .querySelector(".maplibregl-compact-show")
            ?.classList.remove("maplibregl-compact-show");
          onLoad?.(event);
        }}
        {...props}
      >
        <NavigationControl position="top-right" showCompass={false} />
        {children}
      </Map>
    </div>
  );
};
