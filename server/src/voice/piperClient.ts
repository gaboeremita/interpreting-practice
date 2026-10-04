import type { Lang, VoiceOption } from "@isa-drill-room/shared";
import { UpstreamError } from "../errors.js";

export interface SynthesisInput {
  text: string;
  voice: string;
  /** Speaking speed, where 1 is the voice's normal pace. */
  rate: number;
}

/** What VoiceService needs from a TTS server; tests swap in a fake. */
export interface SpeechSynthesizer {
  listVoices(): Promise<VoiceOption[]>;
  /** Returns WAV audio. */
  synthesize(input: SynthesisInput): Promise<Buffer>;
}

interface PiperVoiceConfig {
  language?: { code?: string };
}

const LIST_TIMEOUT_MS = 3_000;
const SYNTHESIS_TIMEOUT_MS = 30_000;

/** Piper's own HTTP server (`python -m piper.http_server`). Lists every voice downloaded next to it. */
export class PiperClient implements SpeechSynthesizer {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async listVoices(): Promise<VoiceOption[]> {
    const response = await this.call("/voices", LIST_TIMEOUT_MS);
    const voices = (await response.json()) as Record<string, PiperVoiceConfig>;

    return Object.entries(voices)
      .flatMap(([id, config]) => {
        const lang = langOfLocale(config.language?.code);
        return lang ? [{ id, lang }] : [];
      })
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  async synthesize({ text, voice, rate }: SynthesisInput): Promise<Buffer> {
    const response = await this.call("/synthesize", SYNTHESIS_TIMEOUT_MS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Piper stretches phonemes instead of taking a speed, so a faster rate is a shorter length.
      body: JSON.stringify({ text, voice, length_scale: 1 / rate }),
    });

    return Buffer.from(await response.arrayBuffer());
  }

  /** Turns network failures, timeouts and error statuses into a 502. */
  private async call(path: string, timeoutMs: number, init: RequestInit = {}): Promise<Response> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, { ...init, signal: AbortSignal.timeout(timeoutMs) });
    } catch {
      throw new UpstreamError("Piper didn't answer. Check that its server is running.");
    }

    if (!response.ok) {
      throw new UpstreamError(`Piper failed with status ${response.status}.`);
    }

    return response;
  }
}

/** Maps a locale such as "es_MX" to a drill language, or null for any other language. */
function langOfLocale(locale: string | undefined): Lang | null {
  const prefix = locale?.slice(0, 2).toLowerCase();

  return prefix === "en" || prefix === "es" ? prefix : null;
}
