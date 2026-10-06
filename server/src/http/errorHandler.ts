import type { ApiError } from "@interpreting-practice/shared";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError, NotFoundError } from "../errors.js";

export const notFoundHandler: RequestHandler = () => {
  throw new NotFoundError("This endpoint doesn't exist.");
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (error instanceof AppError) {
    const body: ApiError = { error: error.message, details: error.details };
    response.status(error.statusCode).json(body);
    return;
  }

  if (isMalformedJson(error)) {
    response.status(400).json({ error: "The request body is not valid JSON." } satisfies ApiError);
    return;
  }

  console.error(error);
  response.status(500).json({ error: "Something went wrong on the server." } satisfies ApiError);
};

function isMalformedJson(error: unknown): boolean {
  return (
    typeof error === "object" && error !== null && "type" in error && error.type === "entity.parse.failed"
  );
}
