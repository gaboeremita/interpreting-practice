/**
 * Type-only contract between the API and the client.
 * Kept as a declaration file so neither side needs to compile or bundle it.
 */

export type Lang = "en" | "es";

export type ItemKind = "l4" | "pain" | "sen" | "turn";

export type Grade = "got" | "close" | "miss";

export type Speaker = "Provider" | "Patient";

export interface DrillItem {
  id: string;
  kind: ItemKind;
  from: Lang;
  prompt: string;
  accepted: string[];
  display: string;
  definition: string;
  units: string[] | null;
  speaker: Speaker | null;
  weight: number;
  /** The bundled answer, present only when the learner has fixed this item's answer. */
  original?: string;
}

export interface AnswerFix {
  /** The corrected answer, in the same format as the glossary cell or model rendition it replaces. */
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface ContentResponse {
  items: DrillItem[];
  quiz: QuizQuestion[];
}

export type SpanishLocale = "es-MX" | "es-US";

/** Where voices come from: the browser's own, or the Piper server the API proxies. */
export type VoiceSource = "browser" | "piper";

/** How many items each sprint holds, relative to the ladder's standard counts. */
export type SprintLength = "short" | "standard" | "long";

export interface Settings {
  voiceSource: VoiceSource;
  /** Browser voice name or Piper voice id, depending on the source. Empty picks one automatically. */
  enVoice: string;
  esVoice: string;
  rate: number;
  typeMode: boolean;
  autoSpeak: boolean;
  micOn: boolean;
  esLocale: SpanishLocale;
  sprintLength: SprintLength;
  /** Item counts that override the preset, keyed by ladder level index or "misses". */
  itemCounts: Record<string, number>;
}

export interface Streak {
  /** Local calendar day of the last finished sprint, formatted YYYY-MM-DD. */
  last: string;
  count: number;
}

export interface Progress {
  learnerId: string;
  xp: number;
  /** Best sprint score (0 to 1) keyed by ladder level index. */
  best: Record<string, number>;
  /** Leitner box (1 to 5) keyed by item id. */
  boxes: Record<string, number>;
  streak: Streak;
  scripts: string;
  unlockAll: boolean;
  settings: Settings;
}

export interface GradedItem {
  itemId: string;
  grade: Grade;
}

export interface SessionSubmission {
  /** Ladder level index, or null for a "redo my misses" sprint. */
  levelIndex: number | null;
  /** Items planned for the sprint; boss sprints score unanswered items as misses. */
  plannedCount: number;
  scoreUnplayed: boolean;
  results: GradedItem[];
  /** The learner's local date, YYYY-MM-DD, so streaks follow their timezone. */
  playedOn: string;
}

export interface SessionOutcome {
  progress: Progress;
  score: number;
  previousBest: number;
  xpEarned: number;
}

export interface VoiceOption {
  id: string;
  lang: Lang;
}

export interface PiperStatus {
  /** False when Piper isn't configured or didn't answer. */
  available: boolean;
  voices: VoiceOption[];
}

export interface SpeechRequest {
  voice: string;
  text: string;
  rate: number;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
