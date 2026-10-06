import type { ApiError } from "@interpreting-practice/shared";

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function apiRequest<T>(method: Method, path: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiRequestError("Can't reach the server. Check that it's running.", 0);
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const apiError = payload as Partial<ApiError> | null;
    throw new ApiRequestError(
      apiError?.error ?? `Request failed (${response.status}).`,
      response.status,
      apiError?.details,
    );
  }

  return payload as T;
}

export function errorMessageOf(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}
