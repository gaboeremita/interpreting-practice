import type { PiperStatus, SpeechRequest } from "@isa-drill-room/shared";
import { apiRequest, ApiRequestError } from "./httpClient";

export const voiceApi = {
  getPiperStatus: () => apiRequest<PiperStatus>("GET", "/voice/piper"),

  /** Audio comes back as a WAV blob rather than JSON, so this skips the JSON client. */
  async synthesize(request: SpeechRequest, signal: AbortSignal): Promise<Blob> {
    const response = await fetch("/api/voice/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal,
    });
    if (!response.ok) {
      throw new ApiRequestError(`Speech request failed (${response.status}).`, response.status);
    }

    return response.blob();
  },
};
