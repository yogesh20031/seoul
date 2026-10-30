import type { Coords, TravelMode } from "@seoul/shared";

const EARTH_RADIUS_KM = 6371;

export const haversineKm = (a: Coords, b: Coords) => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
};

// Straight-line distance undercounts real streets; 1.3 is a common detour factor for dense grids like Seoul.
const DETOUR_FACTOR = 1.3;
const WALK_MAX_KM = 1.2;
const WALK_KMH = 4.5;
const SUBWAY_KMH = 30;
// Walking to the station, waiting, and the transfer at the other end.
const SUBWAY_OVERHEAD_MIN = 12;

export type Leg = { distanceKm: number; travelMin: number; mode: TravelMode };

export const estimateLeg = (from: Coords, to: Coords): Leg => {
  const distanceKm = haversineKm(from, to) * DETOUR_FACTOR;
  if (distanceKm <= WALK_MAX_KM) {
    return {
      distanceKm,
      travelMin: Math.max(1, Math.round((distanceKm / WALK_KMH) * 60)),
      mode: "WALK",
    };
  }
  return {
    distanceKm,
    travelMin: Math.round((distanceKm / SUBWAY_KMH) * 60 + SUBWAY_OVERHEAD_MIN),
    mode: "SUBWAY",
  };
};

/**
 * Orders stops to keep total travel short: nearest-neighbour for a first pass, then 2-opt to undo crossings.
 * With at most 10 stops this is effectively optimal and runs in well under a millisecond.
 * When there's no start point, every stop is tried as the first one and the shortest route wins.
 */
export const orderStops = <T extends Coords>(
  stops: T[],
  start?: Coords,
): T[] => {
  if (stops.length <= 1) return [...stops];

  const routeCost = (route: T[]) => {
    let cost = start ? estimateLeg(start, route[0]!).travelMin : 0;
    for (let i = 1; i < route.length; i++)
      cost += estimateLeg(route[i - 1]!, route[i]!).travelMin;
    return cost;
  };

  const nearestNeighbour = (first: T) => {
    const route = [first];
    const remaining = stops.filter((s) => s !== first);
    while (remaining.length > 0) {
      const last = route[route.length - 1]!;
      let bestIndex = 0;
      for (let i = 1; i < remaining.length; i++) {
        if (
          haversineKm(last, remaining[i]!) <
          haversineKm(last, remaining[bestIndex]!)
        )
          bestIndex = i;
      }
      route.push(remaining.splice(bestIndex, 1)[0]!);
    }
    return route;
  };

  const twoOpt = (initial: T[]) => {
    let route = initial;
    let best = routeCost(route);
    let improved = true;
    while (improved) {
      improved = false;
      for (let i = 0; i < route.length - 1; i++) {
        for (let j = i + 1; j < route.length; j++) {
          const candidate = [
            ...route.slice(0, i),
            ...route.slice(i, j + 1).reverse(),
            ...route.slice(j + 1),
          ];
          const cost = routeCost(candidate);
          if (cost < best) {
            route = candidate;
            best = cost;
            improved = true;
          }
        }
      }
    }
    return { route, cost: best };
  };

  const firstCandidates = start
    ? [
        stops.reduce((best, s) =>
          haversineKm(start, s) < haversineKm(start, best) ? s : best,
        ),
      ]
    : stops;

  return firstCandidates
    .map((first) => twoOpt(nearestNeighbour(first)))
    .reduce((best, current) => (current.cost < best.cost ? current : best))
    .route;
};

export const addMinutes = (time: string, minutes: number) => {
  const [h, m] = time.split(":").map(Number);
  const total = ((h ?? 0) * 60 + (m ?? 0) + minutes) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};
