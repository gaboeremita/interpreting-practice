import type { Lang } from "@isa-drill-room/shared";

export interface VoicePreferences {
  enVoice: string;
  esVoice: string;
  rate: number;
}

const FALLBACK_LOCALE: Record<Lang, string> = { en: "en-US", es: "es-MX" };
const PREFERRED_PREFIXES: Record<Lang, string[]> = { en: ["en-us", "en"], es: ["es-mx", "es-us", "es"] };

/** Browser text-to-speech. Every method is a safe no-op where the browser has no voices. */
export class SpeechService {
  readonly isSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  private voices: SpeechSynthesisVoice[] = [];
  private readonly listeners = new Set<() => void>();

  constructor() {
    if (!this.isSupported) {
      return;
    }
    this.loadVoices();
    speechSynthesis.addEventListener("voiceschanged", () => this.loadVoices());
  }

  getVoices = (): readonly SpeechSynthesisVoice[] => this.voices;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);

    return () => this.listeners.delete(listener);
  };

  /** Resolves when the utterance ends, fails, or is cancelled by a newer one. */
  say(text: string, lang: Lang, preferences: VoicePreferences): Promise<void> {
    if (!this.isSupported) {
      return Promise.resolve();
    }

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.pickVoice(lang, lang === "en" ? preferences.enVoice : preferences.esVoice);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.lang = voice?.lang ?? FALLBACK_LOCALE[lang];
    utterance.rate = preferences.rate;

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

  stop(): void {
    if (this.isSupported) {
      speechSynthesis.cancel();
    }
  }

  private loadVoices(): void {
    this.voices = speechSynthesis.getVoices();
    this.listeners.forEach((listener) => listener());
  }

  private pickVoice(lang: Lang, wantedName: string): SpeechSynthesisVoice | undefined {
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
