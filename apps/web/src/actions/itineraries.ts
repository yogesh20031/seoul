"use server";

import { revalidatePath } from "next/cache";
import {
  planItinerarySchema,
  saveItinerarySchema,
  type Itinerary,
  type ItineraryPlan,
} from "@seoul/shared";
import { apiErrorMessage } from "@/lib/action-errors";
import { api, ApiError } from "@/lib/api";
import { getCurrentUser } from "@/lib/session";

type PlanResult =
  { ok: true; plan: ItineraryPlan } | { ok: false; message: string };
type SaveResult =
  { ok: true; itinerary: Itinerary } | { ok: false; message: string };

const failure = async (error: unknown) => {
  if (error instanceof ApiError)
    return { ok: false as const, message: await apiErrorMessage(error) };
  throw error;
};

// Called from the client planner with plain values rather than FormData, because the stop list
// is ordered client state. Still validated here: a Server Action is a public endpoint.
export const planAction = async (input: unknown): Promise<PlanResult> => {
  const parsed = planItinerarySchema.safeParse(input);
  if (!parsed.success)
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid plan",
    };
  try {
    const plan = await api<ItineraryPlan>("/itineraries/plan", {
      method: "POST",
      body: parsed.data,
      withAuth: false,
    });
    return { ok: true, plan };
  } catch (error) {
    return failure(error);
  }
};

export const saveItineraryAction = async (
  input: unknown,
): Promise<SaveResult> => {
  if (!(await getCurrentUser()))
    return { ok: false, message: "Log in to save and share plans." };
  const parsed = saveItinerarySchema.safeParse(input);
  if (!parsed.success)
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid plan",
    };
  try {
    const itinerary = await api<Itinerary>("/itineraries", {
      method: "POST",
      body: parsed.data,
    });
    revalidatePath("/[locale]/dashboard", "page");
    return { ok: true, itinerary };
  } catch (error) {
    return failure(error);
  }
};
