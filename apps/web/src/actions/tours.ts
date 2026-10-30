"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { z } from "zod";
import {
  createTourSchema,
  idSchema,
  updateTourSchema,
  type TourDetail,
} from "@seoul/shared";
import { api } from "@/lib/api";
import { apiFailure } from "@/lib/action-errors";
import { userWithRole } from "@/lib/auth-guard";
import {
  fieldErrorsFrom,
  formNumber,
  formString,
  type FormState,
} from "@/lib/form";

const tourIdSchema = z.object({ tourId: idSchema });
const notGuide: FormState = {
  status: "error",
  message: "Only guides can manage tours.",
};

// The form sends a Seoul date and time; tours are always scheduled in Seoul time.
const seoulIso = (date: string | undefined, time: string | undefined) =>
  date && time ? `${date}T${time}:00+09:00` : undefined;

const readTourForm = (formData: FormData) => ({
  title: formString(formData, "title"),
  description: formString(formData, "description"),
  startsAt: seoulIso(
    formString(formData, "date"),
    formString(formData, "time"),
  ),
  durationMin: formNumber(formData, "durationMin"),
  meetingName: formString(formData, "meetingName"),
  meetingLat: formNumber(formData, "meetingLat"),
  meetingLng: formNumber(formData, "meetingLng"),
  capacity: formNumber(formData, "capacity"),
  pricePerPerson: formNumber(formData, "pricePerPerson"),
  // Stops are hidden inputs in the order the guide arranged them.
  placeIds: formData
    .getAll("placeIds")
    .filter((value) => typeof value === "string"),
});

const revalidateTours = () => {
  revalidatePath("/[locale]/guide", "layout");
  revalidatePath("/[locale]/tours", "layout");
};

export const createTourAction = async (
  _prev: FormState,
  formData: FormData,
): Promise<FormState> => {
  if (!(await userWithRole("GUIDE"))) return notGuide;
  const parsed = createTourSchema.safeParse(readTourForm(formData));
  if (!parsed.success)
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error) };

  let tour: TourDetail;
  try {
    tour = await api<TourDetail>("/tours", {
      method: "POST",
      body: parsed.data,
    });
  } catch (error) {
    return apiFailure(error);
  }
  revalidateTours();
  redirect(`/${await getLocale()}/tours/${tour.id}`);
};

export const updateTourAction = async (
  _prev: FormState,
  formData: FormData,
): Promise<FormState> => {
  if (!(await userWithRole("GUIDE"))) return notGuide;
  const id = tourIdSchema.safeParse({ tourId: formString(formData, "tourId") });
  const parsed = updateTourSchema.safeParse(readTourForm(formData));
  if (!id.success) return { status: "error", message: "Unknown tour." };
  if (!parsed.success)
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error) };

  try {
    await api(`/tours/${id.data.tourId}`, {
      method: "PATCH",
      body: parsed.data,
    });
  } catch (error) {
    return apiFailure(error);
  }
  revalidateTours();
  redirect(`/${await getLocale()}/tours/${id.data.tourId}`);
};

export const cancelTourAction = async (
  _prev: FormState,
  formData: FormData,
): Promise<FormState> => {
  if (!(await userWithRole("GUIDE"))) return notGuide;
  const id = tourIdSchema.safeParse({ tourId: formString(formData, "tourId") });
  if (!id.success) return { status: "error", message: "Unknown tour." };
  try {
    await api(`/tours/${id.data.tourId}/cancel`, { method: "POST" });
  } catch (error) {
    return apiFailure(error);
  }
  revalidateTours();
  return { status: "success" };
};
