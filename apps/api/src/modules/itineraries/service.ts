import type { Prisma } from "@prisma/client";
import type {
  Itinerary,
  ItineraryPlan,
  PlanItineraryInput,
  PlannedStop,
  SaveItineraryInput,
} from "@seoul/shared";
import { nanoid } from "nanoid";
import { notFound } from "../../lib/http-error";
import { addMinutes, estimateLeg, orderStops } from "../../lib/geo";
import { toPlaceSummary } from "../../lib/mappers";
import { prisma } from "../../lib/prisma";
import { loadPlacesInOrder } from "../places/service";

const round2 = (n: number) => Math.round(n * 100) / 100;

const summarise = (stops: PlannedStop[]): ItineraryPlan => ({
  stops,
  totalDistanceKm: round2(stops.reduce((sum, s) => sum + s.distanceKm, 0)),
  totalTravelMin: stops.reduce((sum, s) => sum + s.travelMin, 0),
  endsAt: stops[stops.length - 1]?.leaveAt ?? "",
});

export const planItinerary = async (
  input: PlanItineraryInput,
): Promise<ItineraryPlan> => {
  const places = await loadPlacesInOrder(input.placeIds);
  const ordered = orderStops(places, input.start);

  let clock = input.startTime;
  let previous = input.start;
  const stops = ordered.map((place, index): PlannedStop => {
    const leg = previous ? estimateLeg(previous, place) : null;
    const arriveAt = addMinutes(clock, leg?.travelMin ?? 0);
    const leaveAt = addMinutes(arriveAt, place.suggestedMinutes);
    clock = leaveAt;
    previous = place;
    return {
      order: index,
      place: toPlaceSummary(place),
      arriveAt,
      leaveAt,
      travelMin: leg?.travelMin ?? 0,
      distanceKm: round2(leg?.distanceKm ?? 0),
      mode: leg?.mode ?? null,
    };
  });
  return summarise(stops);
};

const itineraryInclude = {
  stops: { orderBy: { order: "asc" }, include: { place: true } },
} satisfies Prisma.ItineraryInclude;

type ItineraryRow = Prisma.ItineraryGetPayload<{
  include: typeof itineraryInclude;
}>;

const toItinerary = (row: ItineraryRow): Itinerary => ({
  ...summarise(
    row.stops.map((s) => ({
      order: s.order,
      place: toPlaceSummary(s.place),
      arriveAt: s.arriveAt,
      leaveAt: s.leaveAt,
      travelMin: s.travelMin,
      distanceKm: s.distanceKm,
      mode: s.mode,
    })),
  ),
  id: row.id,
  shareToken: row.shareToken,
  title: row.title,
  date: row.date,
  startTime: row.startTime,
  createdAt: row.createdAt.toISOString(),
});

export const saveItinerary = async (
  ownerId: string,
  input: SaveItineraryInput,
) => {
  const plan = await planItinerary(input);
  const row = await prisma.itinerary.create({
    data: {
      ownerId,
      shareToken: nanoid(10),
      title: input.title,
      date: input.date ?? null,
      startTime: input.startTime,
      startLat: input.start?.lat ?? null,
      startLng: input.start?.lng ?? null,
      stops: {
        create: plan.stops.map((s) => ({
          placeId: s.place.id,
          order: s.order,
          arriveAt: s.arriveAt,
          leaveAt: s.leaveAt,
          travelMin: s.travelMin,
          distanceKm: s.distanceKm,
          mode: s.mode,
        })),
      },
    },
    include: itineraryInclude,
  });
  return toItinerary(row);
};

export const listMyItineraries = async (ownerId: string) => {
  const rows = await prisma.itinerary.findMany({
    where: { ownerId },
    include: itineraryInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toItinerary);
};

export const getSharedItinerary = async (shareToken: string) => {
  const row = await prisma.itinerary.findUnique({
    where: { shareToken },
    include: itineraryInclude,
  });
  if (!row) throw notFound("Itinerary");
  return toItinerary(row);
};
