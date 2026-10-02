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

export interface Settings {
  enVoice: string;
  esVoice: string;
  rate: number;
  typeMode: boolean;
  autoSpeak: boolean;
  micOn: boolean;
  esLocale: SpanishLocale;
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

export interface ApiError {
  error: string;
  details?: unknown;
}
