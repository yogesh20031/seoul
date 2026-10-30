// A handful of real central-Seoul stops for the landing demo. Coordinates are the same as the seed data.
export const DEMO_PLACES = [
  {
    id: "gyeongbokgung",
    en: "Gyeongbokgung",
    ko: "경복궁",
    lat: 37.5796,
    lng: 126.977,
  },
  { id: "bukchon", en: "Bukchon", ko: "북촌", lat: 37.5826, lng: 126.983 },
  { id: "insadong", en: "Insadong", ko: "인사동", lat: 37.574, lng: 126.985 },
  {
    id: "gwangjang",
    en: "Gwangjang Market",
    ko: "광장시장",
    lat: 37.57,
    lng: 126.9996,
  },
  {
    id: "myeongdong",
    en: "Myeongdong",
    ko: "명동",
    lat: 37.5636,
    lng: 126.9822,
  },
  {
    id: "namsan",
    en: "N Seoul Tower",
    ko: "N서울타워",
    lat: 37.5512,
    lng: 126.9882,
  },
  { id: "ddp", en: "DDP", ko: "DDP", lat: 37.5665, lng: 127.0092 },
] as const;

export type DemoPlace = (typeof DEMO_PLACES)[number];

// Map box around the stops, in the SVG's 100 × 80 viewBox.
const BOX = { west: 126.968, east: 127.018, north: 37.589, south: 37.546 };
export const VIEW_W = 100;
export const VIEW_H = 80;

export const project = (place: { lat: number; lng: number }) => ({
  x: ((place.lng - BOX.west) / (BOX.east - BOX.west)) * VIEW_W,
  y: ((BOX.north - place.lat) / (BOX.north - BOX.south)) * VIEW_H,
});

const EARTH_KM = 6371;
const toRad = (deg: number) => (deg * Math.PI) / 180;

const distanceKm = (a: DemoPlace, b: DemoPlace) => {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  // Streets aren't straight lines; the API uses the same 1.3 detour factor.
  return 2 * EARTH_KM * Math.asin(Math.sqrt(h)) * 1.3;
};

// Same rule of thumb as the real planner: walk short hops, take the subway for the rest.
export const legMinutes = (a: DemoPlace, b: DemoPlace) => {
  const km = distanceKm(a, b);
  return Math.round(km <= 1.2 ? (km / 4.5) * 60 : (km / 30) * 60 + 12);
};

const permutations = <T>(items: readonly T[]): T[][] =>
  items.length <= 1
    ? [[...items]]
    : items.flatMap((item, i) =>
        permutations([...items.slice(0, i), ...items.slice(i + 1)]).map(
          (rest) => [item, ...rest],
        ),
      );

/** With at most four stops there are only 24 orders, so just try them all. */
export const bestOrder = (places: DemoPlace[]) => {
  let best = places;
  let bestMinutes = Infinity;
  for (const order of permutations(places)) {
    const minutes = order
      .slice(1)
      .reduce((sum, place, i) => sum + legMinutes(order[i]!, place), 0);
    if (minutes < bestMinutes) {
      best = order;
      bestMinutes = minutes;
    }
  }
  return { order: best, minutes: bestMinutes };
};
