export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

export const badRequest = (message: string, details?: unknown) =>
  new HttpError(400, "BAD_REQUEST", message, details);
export const unauthorized = (message = "Please log in") =>
  new HttpError(401, "UNAUTHORIZED", message);
export const forbidden = (message = "You can't do that") =>
  new HttpError(403, "FORBIDDEN", message);
export const notFound = (what = "Resource") =>
  new HttpError(404, "NOT_FOUND", `${what} not found`);
export const conflict = (message: string) =>
  new HttpError(409, "CONFLICT", message);
