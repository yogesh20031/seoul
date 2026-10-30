import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import type { ApiErrorBody } from "@seoul/shared";
import { HttpError } from "../lib/http-error";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof HttpError) {
    const body: ApiErrorBody = {
      error: { code: err.code, message: err.message, details: err.details },
    };
    res.status(err.status).json(body);
    return;
  }

  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2025"
  ) {
    res.status(404).json({
      error: { code: "NOT_FOUND", message: "Not found" },
    } satisfies ApiErrorBody);
    return;
  }

  // express.json() rejects malformed bodies with a 400-status SyntaxError
  if (err instanceof SyntaxError && "status" in err && err.status === 400) {
    res.status(400).json({
      error: { code: "BAD_REQUEST", message: "Malformed JSON" },
    } satisfies ApiErrorBody);
    return;
  }

  req.log.error({ err }, "unhandled error");
  res.status(500).json({
    error: { code: "INTERNAL", message: "Something went wrong" },
  } satisfies ApiErrorBody);
};
