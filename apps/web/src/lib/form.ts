import type { z } from "zod";

export type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** What the user typed, echoed back because React resets the form after an action. Never include passwords. */
  values?: Record<string, string>;
};

export const idleState: FormState = { status: "idle" };

/** First Zod message per field, keyed by the top-level field name, for inline form errors. */
export const fieldErrorsFrom = (error: z.ZodError) => {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
};

export const formString = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
};

/** Only same-site paths are allowed as a post-login destination, so ?next= can't send people off-site. */
export const safeNextPath = (value: string | undefined) =>
  value &&
  value.startsWith("/") &&
  !value.startsWith("//") &&
  !value.startsWith("/\\")
    ? value
    : null;

/** Number inputs arrive as strings; empty or junk becomes undefined so Zod reports "required" instead of NaN. */
export const formNumber = (formData: FormData, key: string) => {
  const raw = formString(formData, key);
  if (raw === undefined || raw.trim() === "") return undefined;
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
};

/** Comma-separated text field to a trimmed, de-duplicated list. */
export const formList = (formData: FormData, key: string) => [
  ...new Set(
    (formString(formData, key) ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  ),
];
