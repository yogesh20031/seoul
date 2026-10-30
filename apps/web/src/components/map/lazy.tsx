"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";

// MapLibre touches window on import and is ~200 kB, so maps load on the client only, after the page.
const loading = () => (
  <Skeleton className="h-full min-h-64 w-full rounded-2xl" />
);

export const LazyPlacesExplorer = dynamic(
  () => import("./PlacesExplorer").then((m) => m.PlacesExplorer),
  { ssr: false, loading },
);
export const LazyPointMap = dynamic(
  () => import("./PointMap").then((m) => m.PointMap),
  { ssr: false, loading },
);
export const LazyPinPicker = dynamic(
  () => import("./PinPicker").then((m) => m.PinPicker),
  { ssr: false, loading },
);
export const LazyRouteMap = dynamic(
  () => import("./RouteMap").then((m) => m.RouteMap),
  { ssr: false, loading },
);
