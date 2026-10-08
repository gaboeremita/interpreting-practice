import type { DrillItem, Settings, SprintLength } from "@interpreting-practice/shared";
import type { ItemBank } from "./itemBank";

export interface Level {
  name: string;
  description: string;
  pickPool: (bank: ItemBank) => DrillItem[];
  /** Seconds per term; long items get their own time. Null means "derive from the item" (boss call). */
  secondsPerItem: number | null;
  /** Items in a standard-length sprint. */
  itemCount: number;
  audioOnly: boolean;
  isBoss: boolean;
}

/** Score needed on a rung to open the next one. */
export const PASS_MARK = 0.8;
export const BOSS_LIVES = 3;
export const BOSS_TIME_FACTOR = 0.75;

/** Easiest at the top, the boss call at the bottom. */
export const LEVELS: Level[] = [
  {
    name: "Warm-up terms",
    description: "Short L4 terms, English → Spanish, text on screen",
    pickPool: (bank) => bank.warmUp,
    secondsPerItem: 10,
    itemCount: 10,
    audioOnly: false,
    isBoss: false,
  },
  {
    name: "Full L4 glossary",
    description: "Every L4 term, English → Spanish",
    pickPool: (bank) => bank.l4FromEnglish,
    secondsPerItem: 8,
    itemCount: 10,
    audioOnly: false,
    isBoss: false,
  },
  {
    name: "Reverse gear",
    description: "L4 terms, Spanish → English",
    pickPool: (bank) => bank.l4FromSpanish,
    secondsPerItem: 8,
    itemCount: 10,
    audioOnly: false,
    isBoss: false,
  },
  {
    name: "Pain words",
    description: "IMIA pain descriptors, both directions",
    pickPool: (bank) => bank.pain,
    secondsPerItem: 6,
    itemCount: 12,
    audioOnly: false,
    isBoss: false,
  },
  {
    name: "Ears only",
    description: "Terms read aloud, no text. Like the phone",
    pickPool: (bank) => [...bank.l4FromEnglish, ...bank.l4FromSpanish, ...bank.pain],
    secondsPerItem: 7,
    itemCount: 12,
    audioOnly: true,
    isBoss: false,
  },
  {
    name: "One-liners",
    description: "Short patient and provider sentences, audio only",
    pickPool: (bank) => bank.sentences,
    secondsPerItem: 20,
    itemCount: 8,
    audioOnly: true,
    isBoss: false,
  },
  {
    name: "Consecutive turns",
    description: "Long turns with numbers and negations. Scored by units",
    pickPool: (bank) => bank.turns,
    secondsPerItem: 40,
    itemCount: 6,
    audioOnly: true,
    isBoss: false,
  },
  {
    name: "Boss call",
    description: "Everything shuffled, 25% less time, 3 lives",
    pickPool: (bank) => bank.all,
    secondsPerItem: null,
    itemCount: 20,
    audioOnly: true,
    isBoss: true,
  },
];

export const MISSES_LEVEL: Level = {
  name: "My misses",
  description: "",
  pickPool: () => [],
  secondsPerItem: 8,
  itemCount: 12,
  audioOnly: false,
  isBoss: false,
};

export function isLevelUnlocked(
  levelIndex: number,
  best: Record<string, number>,
  unlockAll: boolean,
): boolean {
  return unlockAll || levelIndex === 0 || (best[String(levelIndex - 1)] ?? 0) >= PASS_MARK;
}

/** First open rung that hasn't been passed yet, or the boss call once everything is passed. */
export function nextLevelIndex(best: Record<string, number>, unlockAll: boolean): number {
  const index = LEVELS.findIndex(
    (_, levelIndex) =>
      isLevelUnlocked(levelIndex, best, unlockAll) && (best[String(levelIndex)] ?? 0) < PASS_MARK,
  );

  return index === -1 ? LEVELS.length - 1 : index;
}

/** Settings key for the "redo my misses" sprint's item count; ladder rungs use their index. */
export const MISSES_KEY = "misses";
/** Same bounds the API enforces on a learner's item counts. */
export const MIN_SPRINT_ITEMS = 3;
export const MAX_SPRINT_ITEMS = 100;

export const SPRINT_LENGTHS: { value: SprintLength; label: string; factor: number }[] = [
  { value: "short", label: "Short", factor: 0.5 },
  { value: "standard", label: "Standard", factor: 1 },
  { value: "long", label: "Long", factor: 2 },
];

export function levelKey(levelIndex: number | null): string {
  return levelIndex === null ? MISSES_KEY : String(levelIndex);
}

export function clampItemCount(count: number): number {
  return Math.min(MAX_SPRINT_ITEMS, Math.max(MIN_SPRINT_ITEMS, Math.round(count)));
}

/** The level's item count scaled by the sprint length preset, ignoring per-rung overrides. */
export function presetItemCount(level: Level, sprintLength: SprintLength): number {
  const factor = SPRINT_LENGTHS.find((length) => length.value === sprintLength)?.factor ?? 1;

  return clampItemCount(level.itemCount * factor);
}

/** How many items a sprint asks for: the learner's override for that rung, else the preset's count. */
export function itemCountFor(
  levelIndex: number | null,
  settings: Pick<Settings, "sprintLength" | "itemCounts">,
): number {
  const level = levelIndex === null ? MISSES_LEVEL : LEVELS[levelIndex];
  if (!level) {
    throw new RangeError(`There is no level ${levelIndex}.`);
  }

  return settings.itemCounts[levelKey(levelIndex)] ?? presetItemCount(level, settings.sprintLength);
}
