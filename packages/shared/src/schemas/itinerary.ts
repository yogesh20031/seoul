import { z } from "zod";
import { coordsSchema, idSchema, timeOfDaySchema } from "./common";
import type { PlaceSummary } from "./place";

export const TRAVEL_MODES = ["WALK", "SUBWAY"] as const;
export type TravelMode = (typeof TRAVEL_MODES)[number];

export const planItinerarySchema = z.object({
  placeIds: z.array(idSchema).min(2).max(10),
  start: coordsSchema.optional(),
  startTime: timeOfDaySchema.default("09:00"),
});
export type PlanItineraryInput = z.infer<typeof planItinerarySchema>;

export const saveItinerarySchema = planItinerarySchema.extend({
  title: z.string().trim().min(2).max(80),
  date: z.iso.date().optional(),
});
export type SaveItineraryInput = z.infer<typeof saveItinerarySchema>;

export type PlannedStop = {
  order: number;
  place: PlaceSummary;
  arriveAt: string;
  leaveAt: string;
  /** Travel from the previous stop (or the start point). 0 for the first stop without a start point. */
  travelMin: number;
  distanceKm: number;
  mode: TravelMode | null;
};

export type ItineraryPlan = {
  stops: PlannedStop[];
  totalDistanceKm: number;
  totalTravelMin: number;
  endsAt: string;
};

export type Itinerary = ItineraryPlan & {
  id: string;
  shareToken: string;
  title: string;
  date: string | null;
  startTime: string;
  createdAt: string;
};
