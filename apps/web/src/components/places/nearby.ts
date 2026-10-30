import type { PlaceCategory, PlaceSummary } from "@seoul/shared";

type Point = { lat: number; lng: number };

export type NearbyPlace = { place: PlaceSummary; km: number; walkMin: number };

// Same walking model as the planner API: straight-line distance stretched for real streets.
const DETOUR_FACTOR = 1.3;
const WALK_KMH = 4.5;
const EARTH_RADIUS_KM = 6371;

const toRad = (deg: number) => (deg * Math.PI) / 180;

const haversineKm = (a: Point, b: Point) => {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
};

/** The `limit` closest places to `origin`, nearest first, optionally only from some categories. */
export const nearestPlaces = (
  origin: Point & { slug: string },
  places: PlaceSummary[],
  { limit, categories }: { limit: number; categories: PlaceCategory[] },
): NearbyPlace[] =>
  places
    // Compare slugs, not ids: the place list may be cached from before a re-seed changed the ids.
    .filter(
      (place) =>
        place.slug !== origin.slug && categories.includes(place.category),
    )
    .map((place) => {
      const km = haversineKm(origin, place) * DETOUR_FACTOR;
      return {
        place,
        km,
        walkMin: Math.max(1, Math.round((km / WALK_KMH) * 60)),
      };
    })
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
