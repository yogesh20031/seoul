"use server";

import { revalidatePath } from "next/cache";
import { createReviewSchema, idSchema } from "@seoul/shared";
import { api } from "@/lib/api";
import { apiFailure } from "@/lib/action-errors";
import { userWithRole } from "@/lib/auth-guard";
import {
  fieldErrorsFrom,
  formNumber,
  formString,
  type FormState,
} from "@/lib/form";

export const createReviewAction = async (
  _prev: FormState,
  formData: FormData,
): Promise<FormState> => {
  if (!(await userWithRole("TRAVELLER")))
    return { status: "error", message: "Only travellers can leave reviews." };
  const guideId = idSchema.safeParse(formString(formData, "guideId"));
  const parsed = createReviewSchema.safeParse({
    rating: formNumber(formData, "rating"),
    comment: formString(formData, "comment"),
    bookingId: formString(formData, "bookingId") || undefined,
    soloRequestId: formString(formData, "soloRequestId") || undefined,
  });
  if (!guideId.success) return { status: "error", message: "Unknown guide." };
  if (!parsed.success)
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error) };

  try {
    await api(`/guides/${guideId.data}/reviews`, {
      method: "POST",
      body: parsed.data,
    });
  } catch (error) {
    return apiFailure(error);
  }
  revalidatePath("/[locale]/dashboard", "page");
  revalidatePath(`/[locale]/guides/[id]`, "page");
  return { status: "success" };
};
