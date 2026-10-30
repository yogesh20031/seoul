"use server";

import { apiErrorMessage } from "@/lib/action-errors";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { loginSchema, registerSchema, type AuthResponse } from "@seoul/shared";
import { api, ApiError } from "@/lib/api";
import { clearSession, setSession } from "@/lib/session";
import {
  fieldErrorsFrom,
  formString,
  safeNextPath,
  type FormState,
} from "@/lib/form";

const homeFor = (role: AuthResponse["user"]["role"]) =>
  role === "GUIDE" ? "/guide" : "/dashboard";

const finish = async (auth: AuthResponse, next: string | null) => {
  await setSession(auth.token);
  const locale = await getLocale();
  redirect(next ?? `/${locale}${homeFor(auth.user.role)}`);
};

export const loginAction = async (
  _prev: FormState,
  formData: FormData,
): Promise<FormState> => {
  const values = { email: formString(formData, "email") ?? "" };
  const parsed = loginSchema.safeParse({
    ...values,
    password: formString(formData, "password"),
  });
  if (!parsed.success)
    return {
      status: "error",
      fieldErrors: fieldErrorsFrom(parsed.error),
      values,
    };

  let auth: AuthResponse;
  try {
    auth = await api<AuthResponse>("/auth/login", {
      method: "POST",
      body: parsed.data,
      withAuth: false,
    });
  } catch (error) {
    if (error instanceof ApiError)
      return { status: "error", message: await apiErrorMessage(error), values };
    throw error;
  }
  return finish(auth, safeNextPath(formString(formData, "next")));
};

export const signupAction = async (
  _prev: FormState,
  formData: FormData,
): Promise<FormState> => {
  const values = {
    name: formString(formData, "name") ?? "",
    email: formString(formData, "email") ?? "",
    role: formString(formData, "role") ?? "",
  };
  const parsed = registerSchema.safeParse({
    ...values,
    password: formString(formData, "password"),
    locale: await getLocale(),
  });
  if (!parsed.success)
    return {
      status: "error",
      fieldErrors: fieldErrorsFrom(parsed.error),
      values,
    };

  let auth: AuthResponse;
  try {
    auth = await api<AuthResponse>("/auth/register", {
      method: "POST",
      body: parsed.data,
      withAuth: false,
    });
  } catch (error) {
    if (error instanceof ApiError)
      return { status: "error", message: await apiErrorMessage(error), values };
    throw error;
  }
  return finish(auth, safeNextPath(formString(formData, "next")));
};

export const logoutAction = async () => {
  await clearSession();
  redirect(`/${await getLocale()}`);
};
