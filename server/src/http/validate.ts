import type { z } from "zod";
import { ValidationError } from "../errors.js";

/** Parses untrusted input or throws a 422 listing every problem found. */
export function validate<Schema extends z.ZodType>(schema: Schema, input: unknown): z.infer<Schema> {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(
      "The request is invalid.",
      result.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
    );
  }

  return result.data;
}
