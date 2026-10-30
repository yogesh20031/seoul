"use server";

import { revalidatePath } from "next/cache";
import { updateGuideProfileSchema, updateMeSchema } from "@seoul/shared";
import { api } from "@/lib/api";
import { apiFailure } from "@/lib/action-errors";
import { userWithRole } from "@/lib/auth-guard";
import { getCurrentUser } from "@/lib/session";
import {
  fieldErrorsFrom,
  formList,
  formNumber,
  formString,
  type FormState,
} from "@/lib/form";

export const updateMeAction = async (
  _prev: FormState,
  formData: FormData,
): Promise<FormState> => {
  if (!(await getCurrentUser()))
    return { status: "error", message: "Log in first." };
  const avatarUrl = formString(formData, "avatarUrl")?.trim();
  const parsed = updateMeSchema.safeParse({
    name: formString(formData, "name"),
    bio: formString(formData, "bio"),
    country: formString(formData, "country"),
    // An emptied field means "remove my photo".
    avatarUrl: avatarUrl ? avatarUrl : null,
  });
  if (!parsed.success)
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error) };

  try {
    await api("/users/me", { method: "PATCH", body: parsed.data });
  } catch (error) {
    return apiFailure(error);
  }
  revalidatePath("/[locale]", "layout");
  return { status: "success" };
};

export const updateGuideProfileAction = async (
  _prev: FormState,
  formData: FormData,
): Promise<FormState> => {
  if (!(await userWithRole("GUIDE")))
    return { status: "error", message: "Only guides have a guide profile." };
  const parsed = updateGuideProfileSchema.safeParse({
    headline: formString(formData, "headline"),
    languages: formList(formData, "languages"),
    specialties: formList(formData, "specialties"),
    soloPrice: formNumber(formData, "soloPrice"),
    soloDurationMin: formNumber(formData, "soloDurationMin"),
  });
  if (!parsed.success)
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error) };

  try {
    await api("/guides/me", { method: "PUT", body: parsed.data });
  } catch (error) {
    return apiFailure(error);
  }
  revalidatePath("/[locale]/guide", "layout");
  revalidatePath("/[locale]/guides", "layout");
  return { status: "success" };
};
