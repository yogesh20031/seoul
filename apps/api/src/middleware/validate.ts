import type { z } from "zod";
import { badRequest } from "../lib/http-error";

/** Parses or throws a 400 with Zod's flattened issues, so every route rejects bad input the same way. */
export const parse = <Schema extends z.ZodType>(
  schema: Schema,
  input: unknown,
): z.output<Schema> => {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw badRequest(
      "Invalid input",
      result.error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    );
  }
  return result.data;
};
