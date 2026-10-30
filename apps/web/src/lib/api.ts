import "server-only";
import type { ApiErrorBody } from "@seoul/shared";
import { getToken } from "./session";

const API_URL = (process.env.API_URL ?? "http://localhost:4000").replace(
  /\/$/,
  "",
);

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  /** Seconds to cache a public GET. Requests that carry the user's token are never cached. */
  revalidate?: number;
  /** Send the logged-in user's token. On by default; turn off for public, cacheable reads. */
  withAuth?: boolean;
};

const isApiErrorBody = (value: unknown): value is ApiErrorBody =>
  typeof value === "object" &&
  value !== null &&
  "error" in value &&
  typeof value.error === "object" &&
  value.error !== null &&
  "message" in value.error;

const buildUrl = (path: string, query: ApiOptions["query"]) => {
  const url = new URL(`${API_URL}/api/v1${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== null && value !== "")
      url.searchParams.set(key, String(value));
  }
  return url;
};

/**
 * Server-side call to our Express API. The token stays on the server: the browser only ever
 * holds the httpOnly cookie, and this forwards it as a Bearer header.
 *
 * Response bodies are typed by the shared contract in @seoul/shared, which the API is written
 * against and tested with. It's our own service, so we trust that contract instead of
 * re-validating every response here.
 */
export const api = async <T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> => {
  const { method = "GET", body, query, revalidate, withAuth = true } = options;
  const token = withAuth ? await getToken() : null;

  const headers: HeadersInit = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const cacheable = method === "GET" && !token && revalidate !== undefined;

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      ...(cacheable ? { next: { revalidate } } : { cache: "no-store" }),
    });
  } catch {
    // Render's free tier sleeps when idle; the first request can fail or time out while it wakes.
    throw new ApiError(
      503,
      "API_UNREACHABLE",
      "Our server is waking up. Please try again in a few seconds.",
    );
  }

  if (!res.ok) {
    const failure: unknown = await res.json().catch(() => null);
    if (isApiErrorBody(failure)) {
      throw new ApiError(
        res.status,
        failure.error.code,
        failure.error.message,
        failure.error.details,
      );
    }
    throw new ApiError(res.status, "UNKNOWN", `Request failed (${res.status})`);
  }

  // See the note above: the shape is guaranteed by the shared API contract.
  const data: T = await res.json();
  return data;
};
