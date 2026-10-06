import type { Lang, PiperStatus, Settings, SpeechRequest } from "@interpreting-practice/shared";
import { voiceApi } from "../api/voiceApi";

export type VoicePreferences = Pick<Settings, "voiceSource" | "enVoice" | "esVoice" | "rate">;

const FALLBACK_LOCALE: Record<Lang, string> = { en: "en-US", es: "es-MX" };
const PREFERRED_PREFIXES: Record<Lang, string[]> = { en: ["en-us", "en"], es: ["es-mx", "es-us", "es"] };
/** Each clip is ~100 KB of WAV; this keeps a sprint's worth of replays without a round trip. */
const MAX_CACHED_CLIPS = 60;

/**
 * Text-to-speech through the browser's voices or the Piper server the API proxies.
 * Piper falling over falls back to the browser, and every method is a safe no-op without voices.
 */
export class SpeechService {
  readonly isSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  private voices: SpeechSynthesisVoice[] = [];
  private piper: PiperStatus = { available: false, voices: [] };
  private piperLoad: Promise<void> = Promise.resolve();
  private readonly listeners = new Set<() => void>();
  private readonly clipUrls = new Map<string, string>();
  private audio: HTMLAudioElement | null = null;
  private serverPlayback: AbortController | null = null;

  constructor() {
    if (typeof window === "undefined") {
      return;
    }
    void this.refreshPiper();
    if (this.isSupported) {
      this.loadVoices();
      speechSynthesis.addEventListener("voiceschanged", () => this.loadVoices());
    }
  }

  getVoices = (): readonly SpeechSynthesisVoice[] => this.voices;

  getPiperStatus = (): PiperStatus => this.piper;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);

    return () => this.listeners.delete(listener);
  };

  /** Asks the API whether Piper is up. Safe to call again, for example after starting it. */
  refreshPiper(): Promise<void> {
    this.piperLoad = voiceApi
      .getPiperStatus()
      .then((piper) => {
        this.piper = piper;
        this.notify();
      })
      .catch(() => {
        // Without Piper's voices, everything speaks with the browser's.
      });

    return this.piperLoad;
  }

  /** Resolves when the speech ends, fails, or is cancelled by a newer one. */
  async say(text: string, lang: Lang, preferences: VoicePreferences): Promise<void> {
    this.stop();
    const usesPiper = preferences.voiceSource === "piper";
    const wantedVoice = lang === "en" ? preferences.enVoice : preferences.esVoice;

    if (usesPiper) {
      const controller = new AbortController();
      this.serverPlayback = controller;
      await this.piperLoad;
      const voice = this.pickPiperVoice(lang, wantedVoice);
      if (voice && !controller.signal.aborted) {
        const outcome = await this.playFromServer({ voice, text, rate: preferences.rate }, controller);
        if (outcome !== "failed") {
          return;
        }
        console.warn("Piper failed, so the browser voice is speaking instead.");
      }
      if (controller.signal.aborted) {
        return;
      }
    }

    // The saved voice is a Piper one when Piper is chosen, so the browser picks its own.
    return this.sayInBrowser(text, lang, usesPiper ? "" : wantedVoice, preferences.rate);
  }

  stop(): void {
    this.serverPlayback?.abort();
    this.serverPlayback = null;
    this.audio?.pause();
    if (this.isSupported) {
      speechSynthesis.cancel();
    }
  }

  private async playFromServer(
    request: SpeechRequest,
    controller: AbortController,
  ): Promise<"done" | "failed"> {
    let url: string;
    try {
      url = await this.clipUrlFor(request, controller.signal);
    } catch {
      return controller.signal.aborted ? "done" : "failed";
    }
    if (controller.signal.aborted) {
      return "done";
    }

    this.audio ??= new Audio();
    const audio = this.audio;
    audio.src = url;

    return new Promise((resolve) => {
      const finish = (outcome: "done" | "failed") => {
        audio.onended = null;
        audio.onerror = null;
        controller.signal.removeEventListener("abort", onAbort);
        resolve(outcome);
      };
      const onAbort = () => finish("done");
      audio.onended = () => finish("done");
      audio.onerror = () => finish("failed");
      controller.signal.addEventListener("abort", onAbort);
      audio.play().catch(() => finish(controller.signal.aborted ? "done" : "failed"));
    });
  }

  private async clipUrlFor(request: SpeechRequest, signal: AbortSignal): Promise<string> {
    const key = JSON.stringify([request.voice, request.rate, request.text]);
    const cached = this.clipUrls.get(key);
    if (cached) {
      return cached;
    }

    const url = URL.createObjectURL(await voiceApi.synthesize(request, signal));
    this.clipUrls.set(key, url);
    if (this.clipUrls.size > MAX_CACHED_CLIPS) {
      const [oldestKey, oldestUrl] = this.clipUrls.entries().next().value as [string, string];
      this.clipUrls.delete(oldestKey);
      URL.revokeObjectURL(oldestUrl);
    }

    return url;
  }

  private pickPiperVoice(lang: Lang, wantedId: string): string | undefined {
    const voices = this.piper.voices.filter((voice) => voice.lang === lang);

    return (voices.find((voice) => voice.id === wantedId) ?? voices[0])?.id;
  }

  private sayInBrowser(text: string, lang: Lang, wantedName: string, rate: number): Promise<void> {
    if (!this.isSupported) {
      return Promise.resolve();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.pickBrowserVoice(lang, wantedName);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.lang = voice?.lang ?? FALLBACK_LOCALE[lang];
    utterance.rate = rate;

    return new Promise((resolve) => {
      // Some engines never fire "end", so an estimate of the speaking time resolves it anyway.
      const fallback = setTimeout(resolve, 1500 + (text.length * 90) / utterance.rate);
      const finish = () => {
        clearTimeout(fallback);
        resolve();
      };
      utterance.onend = finish;
      utterance.onerror = finish;
      speechSynthesis.speak(utterance);
    });
  }

  private loadVoices(): void {
    this.voices = speechSynthesis.getVoices();
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  private pickBrowserVoice(lang: Lang, wantedName: string): SpeechSynthesisVoice | undefined {
    const byName = this.voices.find((voice) => voice.name === wantedName);
    if (byName) {
      return byName;
    }

    for (const prefix of PREFERRED_PREFIXES[lang]) {
      const match = this.voices.find((voice) => voice.lang.toLowerCase().startsWith(prefix));
      if (match) {
        return match;
      }
    }

    return undefined;
  }
}
