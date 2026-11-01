"use server";

import { revalidatePath } from "next/cache";
import {
  createReviewSchema,
  idSchema,
  type CreatedReview,
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

/** On success it carries the guide's new score, so the traveller sees their rating counted. */
export type ReviewFormState = FormState & {
  guideRating?: CreatedReview["guideRating"];
};

export const createReviewAction = async (
  _prev: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> => {
  if (!(await userWithRole("TRAVELLER")))
    return { status: "error", message: "Only travellers can leave reviews." };
  const guideId = idSchema.safeParse(formString(formData, "guideId"));
  const parsed = createReviewSchema.safeParse({
    rating: formNumber(formData, "rating"),
    comment: formString(formData, "comment"),
    bookingId: formString(formData, "bookingId") || undefined,
    soloRequestId: formString(formData, "soloRequestId") || undefined,
  });
  // React resets the form after an action, so a failed post shouldn't throw away the comment.
  const values = { comment: formString(formData, "comment") ?? "" };
  if (!guideId.success) return { status: "error", message: "Unknown guide." };
  if (!parsed.success)
    return {
      status: "error",
      fieldErrors: fieldErrorsFrom(parsed.error),
      values,
    };

  let created: CreatedReview;
  try {
    created = await api<CreatedReview>(`/guides/${guideId.data}/reviews`, {
      method: "POST",
      body: parsed.data,
    });
  } catch (error) {
    return { ...(await apiFailure(error)), values };
  }
  // Guide reads are cached, so refresh them for the new score. The dashboard is always dynamic;
  // RateTripsCard keeps the thank-you on screen through the refresh this triggers.
  revalidatePath(`/[locale]/guides/[id]`, "page");
  revalidatePath("/[locale]/guides", "page");
  return { status: "success", guideRating: created.guideRating };
};
