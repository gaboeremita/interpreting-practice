import { createHash } from "node:crypto";
import type { PiperStatus, SpeechRequest, VoiceOption } from "@isa-drill-room/shared";
import { NotFoundError, ValidationError } from "../errors.js";
import { AudioCache } from "./audioCache.js";
import type { SpeechSynthesizer } from "./piperClient.js";

/** Long enough that a sprint doesn't re-ask for voices on every prompt, short enough to notice a new download. */
const VOICE_LIST_TTL_MS = 60_000;
/** Drill prompts are a fixed set of phrases, so this holds a few hundred clips: most of what a learner hears. */
const AUDIO_CACHE_BYTES = 64 * 1024 * 1024;

/** Proxies Piper, so the browser never talks to it directly. */
export class VoiceService {
  private voiceList: { voices: VoiceOption[]; fetchedAt: number } | null = null;

  /** `synthesizer` is null when PIPER_TTS_URL isn't set. */
  constructor(
    private readonly synthesizer: SpeechSynthesizer | null,
    private readonly audioCache = new AudioCache(AUDIO_CACHE_BYTES),
    private readonly now: () => number = Date.now,
  ) {}

  async status(): Promise<PiperStatus> {
    if (!this.synthesizer) {
      return { available: false, voices: [] };
    }

    try {
      return { available: true, voices: await this.voices(this.synthesizer) };
    } catch {
      return { available: false, voices: [] };
    }
  }

  async synthesize({ voice, text, rate }: SpeechRequest): Promise<Buffer> {
    if (!this.synthesizer) {
      throw new NotFoundError("Piper isn't configured on this server.");
    }

    // Piper quietly swaps an unknown voice for its default, so check against the real list first.
    const voices = await this.voices(this.synthesizer);
    if (!voices.some((option) => option.id === voice)) {
      throw new ValidationError(`Piper has no voice called "${voice}".`);
    }

    const key = createHash("sha256")
      .update(JSON.stringify([voice, rate, text]))
      .digest("hex");
    const cached = this.audioCache.get(key);
    if (cached) {
      return cached;
    }

    const audio = await this.synthesizer.synthesize({ text, voice, rate });
    this.audioCache.set(key, audio);

    return audio;
  }

  private async voices(synthesizer: SpeechSynthesizer): Promise<VoiceOption[]> {
    if (this.voiceList && this.now() - this.voiceList.fetchedAt < VOICE_LIST_TTL_MS) {
      return this.voiceList.voices;
    }

    const voices = await synthesizer.listVoices();
    this.voiceList = { voices, fetchedAt: this.now() };

    return voices;
  }
}
