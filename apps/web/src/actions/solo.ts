"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { z } from "zod";
import {
  acceptSoloRequestSchema,
  createSoloRequestSchema,
  idSchema,
  type CheckoutResponse,
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

const requestSchema = createSoloRequestSchema.extend({ guideId: idSchema });
const acceptSchema = acceptSoloRequestSchema.extend({ requestId: idSchema });
const requestIdSchema = z.object({ requestId: idSchema });

const parseRequestId = (formData: FormData) =>
  requestIdSchema.safeParse({ requestId: formString(formData, "requestId") });

export const requestSoloAction = async (
  _prev: FormState,
  formData: FormData,
): Promise<FormState> => {
  if (!(await userWithRole("TRAVELLER")))
    return {
      status: "error",
      message: "Log in as a traveller to book a private tour.",
    };
  const parsed = requestSchema.safeParse({
    guideId: formString(formData, "guideId"),
    date: formString(formData, "date"),
    startTime: formString(formData, "startTime"),
    note: formString(formData, "note"),
  });
  if (!parsed.success)
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error) };

  const { guideId, ...body } = parsed.data;
  try {
    await api(`/guides/${guideId}/solo-requests`, { method: "POST", body });
  } catch (error) {
    return apiFailure(error);
  }
  revalidatePath("/[locale]/dashboard", "page");
  return { status: "success" };
};

export const paySoloAction = async (
  _prev: FormState,
  formData: FormData,
): Promise<FormState> => {
  if (!(await userWithRole("TRAVELLER")))
    return { status: "error", message: "Log in as a traveller." };
  const parsed = parseRequestId(formData);
  if (!parsed.success) return { status: "error", message: "Unknown request." };

  let checkout: CheckoutResponse;
  try {
    checkout = await api<CheckoutResponse>(
      `/solo-requests/${parsed.data.requestId}/pay`,
      {
        method: "POST",
        body: { locale: await getLocale() },
      },
    );
  } catch (error) {
    return apiFailure(error);
  }
  redirect(checkout.checkoutUrl);
};

export const cancelSoloAction = async (
  _prev: FormState,
  formData: FormData,
): Promise<FormState> => {
  if (!(await userWithRole("TRAVELLER")))
    return { status: "error", message: "Log in as a traveller." };
  const parsed = parseRequestId(formData);
  if (!parsed.success) return { status: "error", message: "Unknown request." };
  try {
    await api(`/solo-requests/${parsed.data.requestId}/cancel`, {
      method: "POST",
    });
  } catch (error) {
    return apiFailure(error);
  }
  revalidatePath("/[locale]/dashboard", "page");
  return { status: "success" };
};

export const acceptSoloAction = async (
  _prev: FormState,
  formData: FormData,
): Promise<FormState> => {
  if (!(await userWithRole("GUIDE")))
    return { status: "error", message: "Only guides can accept requests." };
  const parsed = acceptSchema.safeParse({
    requestId: formString(formData, "requestId"),
    meetingName: formString(formData, "meetingName"),
    meetingLat: formNumber(formData, "meetingLat"),
    meetingLng: formNumber(formData, "meetingLng"),
    startTime: formString(formData, "startTime") || undefined,
  });
  if (!parsed.success)
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error) };

  const { requestId, ...body } = parsed.data;
  try {
    await api(`/solo-requests/${requestId}/accept`, { method: "POST", body });
  } catch (error) {
    return apiFailure(error);
  }
  revalidatePath("/[locale]/guide", "page");
  return { status: "success" };
};

export const declineSoloAction = async (
  _prev: FormState,
  formData: FormData,
): Promise<FormState> => {
  if (!(await userWithRole("GUIDE")))
    return { status: "error", message: "Only guides can decline requests." };
  const parsed = parseRequestId(formData);
  if (!parsed.success) return { status: "error", message: "Unknown request." };
  try {
    await api(`/solo-requests/${parsed.data.requestId}/decline`, {
      method: "POST",
    });
  } catch (error) {
    return apiFailure(error);
  }
  revalidatePath("/[locale]/guide", "page");
  return { status: "success" };
};
