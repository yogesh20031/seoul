"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { z } from "zod";
import {
  createBookingSchema,
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

const bookSchema = createBookingSchema.extend({ tourId: idSchema });
const bookingIdSchema = z.object({ bookingId: idSchema });

export const bookTourAction = async (
  _prev: FormState,
  formData: FormData,
): Promise<FormState> => {
  if (!(await userWithRole("TRAVELLER")))
    return { status: "error", message: "Log in as a traveller to book." };
  const parsed = bookSchema.safeParse({
    tourId: formString(formData, "tourId"),
    seats: formNumber(formData, "seats"),
    locale: await getLocale(),
  });
  if (!parsed.success)
    return { status: "error", fieldErrors: fieldErrorsFrom(parsed.error) };

  const { tourId, ...body } = parsed.data;
  let checkout: CheckoutResponse;
  try {
    checkout = await api<CheckoutResponse>(`/tours/${tourId}/bookings`, {
      method: "POST",
      body,
    });
  } catch (error) {
    return apiFailure(error);
  }
  // Stripe Checkout in stripe mode, our own success page in mock mode.
  redirect(checkout.checkoutUrl);
};

export const cancelBookingAction = async (
  _prev: FormState,
  formData: FormData,
): Promise<FormState> => {
  if (!(await userWithRole("TRAVELLER")))
    return { status: "error", message: "Log in as a traveller." };
  const parsed = bookingIdSchema.safeParse({
    bookingId: formString(formData, "bookingId"),
  });
  if (!parsed.success) return { status: "error", message: "Unknown booking." };

  try {
    await api(`/bookings/${parsed.data.bookingId}/cancel`, { method: "POST" });
  } catch (error) {
    return apiFailure(error);
  }
  revalidatePath("/[locale]/dashboard", "page");
  revalidatePath("/[locale]/tours/[id]", "page");
  return { status: "success" };
};
