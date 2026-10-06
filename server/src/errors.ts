/** An error whose message is safe to show to API clients, with the HTTP status it maps to. */
export class AppError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 422, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}

/** A service the API depends on (such as a TTS server) failed or didn't answer. */
export class UpstreamError extends AppError {
  constructor(message: string) {
    super(message, 502);
  }
}
