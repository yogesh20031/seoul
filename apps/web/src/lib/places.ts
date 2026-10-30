import "server-only";
import type { Paginated, Place, PlaceSummary } from "@seoul/shared";
import { api } from "./api";

// Only what pickers, markers and route maps need, to keep client payloads small.
export const toPlaceSummary = ({
  id,
  slug,
  category,
  nameEn,
  nameKo,
  district,
  lat,
  lng,
  imageUrl,
  suggestedMinutes,
}: Place): PlaceSummary => ({
  id,
  slug,
  category,
  nameEn,
  nameKo,
  district,
  lat,
  lng,
  imageUrl,
  suggestedMinutes,
});

/** Every place as a summary. The whole guide is under 100 places, so one page covers it. */
export const loadAllPlaceSummaries = async () => {
  const places = await api<Paginated<Place>>("/places", {
    withAuth: false,
    revalidate: 3600,
    query: { pageSize: 100 },
  });
  return places.items.map(toPlaceSummary);
};
