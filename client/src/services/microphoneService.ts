import type { Lang, SpanishLocale } from "@isa-drill-room/shared";

export type MicrophoneStatus = "unknown" | "unsupported" | "blocked" | "ready";

export interface ListenHandlers {
  /** Keep listening across pauses (long answers) instead of stopping after the first phrase. */
  continuous: boolean;
  onUpdate: (finalText: string, interimText: string) => void;
  onDone: (finalText: string, alternatives: string[]) => void;
}

const SILENCE_STOP_MS = 2200;
const FATAL_ERRORS = ["not-allowed", "service-not-allowed", "audio-capture", "network"];

/**
 * Live speech-to-text plus a recording of the answer for playback.
 * One session at a time: starting a new one cancels the previous one.
 */
export class MicrophoneService {
  readonly isSupported: boolean;
  /** Embedded pages (iframes) usually can't get microphone permission. */
  readonly isInFrame: boolean;
  status: MicrophoneStatus = "unknown";
  recordingUrl = "";

  private readonly Recognition: SpeechRecognitionConstructor | null;
  private stream: MediaStream | null = null;
  private recognition: SpeechRecognition | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private handlers: ListenHandlers | null = null;
  private keepListening = false;
  private silenceTimer: ReturnType<typeof setTimeout> | undefined;
  private transcript = "";
  private alternatives: string[] = [];

  constructor() {
    this.Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
    this.isSupported = Boolean(this.Recognition && navigator.mediaDevices?.getUserMedia);
    this.isInFrame = MicrophoneService.detectFrame();
  }

  isActive(): boolean {
    return this.handlers !== null;
  }

  /** Asks for microphone permission once and remembers the answer. */
  async ensureAccess(): Promise<MicrophoneStatus> {
    if (this.status !== "unknown") {
      return this.status;
    }
    if (!this.isSupported) {
      this.status = "unsupported";
      return this.status;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.status = "ready";
    } catch {
      this.status = "blocked";
    }

    return this.status;
  }

  start(lang: Lang, spanishLocale: SpanishLocale, handlers: ListenHandlers): void {
    this.cancel();
    this.handlers = handlers;
    this.transcript = "";
    this.alternatives = [];
    this.keepListening = true;
    this.startRecorder();
    this.listen(lang === "es" ? spanishLocale : "en-US");
  }

  /** Stops listening and reports what was heard through onDone. */
  stop(): void {
    this.keepListening = false;
    clearTimeout(this.silenceTimer);
    if (!this.recognition) {
      this.finish();
      return;
    }
    try {
      this.recognition.stop();
    } catch {
      this.finish();
    }
  }

  /** Stops listening without calling onDone. */
  cancel(): void {
    this.keepListening = false;
    clearTimeout(this.silenceTimer);
    const recognition = this.recognition;
    this.recognition = null;
    this.handlers = null;
    try {
      recognition?.abort();
    } catch {
      // Already stopped.
    }
    this.stopRecorder();
  }

  playRecording(): void {
    if (this.recordingUrl) {
      void new Audio(this.recordingUrl).play().catch(() => undefined);
    }
  }

  private listen(locale: string): void {
    if (!this.Recognition || !this.handlers) {
      return;
    }

    const recognition = new this.Recognition();
    recognition.lang = locale;
    recognition.continuous = this.handlers.continuous;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    const transcriptBefore = this.transcript;

    recognition.onresult = (event) => this.handleResult(event, recognition, transcriptBefore);
    recognition.onerror = (event) => {
      if (FATAL_ERRORS.includes(event.error)) {
        if (event.error !== "network") {
          this.status = "blocked";
        }
        this.keepListening = false;
      }
    };
    recognition.onend = () => {
      if (this.recognition !== recognition) {
        return;
      }
      // Nothing heard yet and the clock is still running: keep listening.
      if (this.keepListening && !this.transcript) {
        this.listen(locale);
        return;
      }
      this.finish();
    };

    this.recognition = recognition;
    try {
      recognition.start();
    } catch {
      this.finish();
    }
  }

  private handleResult(
    event: SpeechRecognitionEvent,
    recognition: SpeechRecognition,
    transcriptBefore: string,
  ): void {
    let finalText = "";
    let interimText = "";
    const alternatives: string[] = [];

    for (let i = 0; i < event.results.length; i++) {
      const result = event.results[i];
      if (!result) {
        continue;
      }
      if (result.isFinal) {
        finalText += `${result[0]?.transcript ?? ""} `;
        for (let k = 0; k < result.length; k++) {
          alternatives.push(result[k]?.transcript ?? "");
        }
      } else {
        interimText += result[0]?.transcript ?? "";
      }
    }

    this.transcript = `${transcriptBefore} ${finalText}`.trim();
    this.alternatives = alternatives;

    // Long answers end after a short pause instead of waiting for the clock.
    clearTimeout(this.silenceTimer);
    if (recognition.continuous && (this.transcript || interimText)) {
      this.silenceTimer = setTimeout(() => this.stop(), SILENCE_STOP_MS);
    }
    this.handlers?.onUpdate(this.transcript, interimText);
  }

  private finish(): void {
    const handlers = this.handlers;
    this.handlers = null;
    this.recognition = null;
    clearTimeout(this.silenceTimer);
    this.stopRecorder(() => handlers?.onDone(this.transcript, this.alternatives));
  }

  private startRecorder(): void {
    if (!this.stream || typeof MediaRecorder === "undefined") {
      return;
    }

    this.chunks = [];
    try {
      this.recorder = new MediaRecorder(this.stream);
    } catch {
      this.recorder = null;
      return;
    }
    this.recorder.ondataavailable = (event) => {
      if (event.data.size) {
        this.chunks.push(event.data);
      }
    };
    this.recorder.start();
  }

  private stopRecorder(onStopped?: () => void): void {
    const recorder = this.recorder;
    this.recorder = null;
    if (!recorder || recorder.state === "inactive") {
      onStopped?.();
      return;
    }

    recorder.onstop = () => {
      if (this.recordingUrl) {
        URL.revokeObjectURL(this.recordingUrl);
      }
      this.recordingUrl = this.chunks.length
        ? URL.createObjectURL(new Blob(this.chunks, { type: recorder.mimeType }))
        : "";
      onStopped?.();
    };
    recorder.stop();
  }

  private static detectFrame(): boolean {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  }
}
