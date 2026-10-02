import type { DrillItem, Grade } from "@isa-drill-room/shared";
import { shuffled } from "../lib/random";
import type { ItemBank } from "./itemBank";
import type { Level } from "./levels";
import { BOSS_TIME_FACTOR, LEVELS, MISSES_LEVEL } from "./levels";

export interface Sprint {
  /** Null for a "redo my misses" sprint, which is not a ladder rung. */
  levelIndex: number | null;
  level: Level;
  items: DrillItem[];
}

export interface SprintResult {
  item: DrillItem;
  grade: Grade;
}

/** Review weight per Leitner box: box 1 items are 16× likelier to come up than box 5 items. */
const BOX_WEIGHTS = [0, 8, 4, 2, 1, 0.5];
const LONG_ITEM_SECONDS: Partial<Record<DrillItem["kind"], number>> = { turn: 40, sen: 20 };
const DEFAULT_SECONDS = 7;

export function boxOf(itemId: string, boxes: Record<string, number>): number {
  return boxes[itemId] ?? 1;
}

/** Items the learner missed last time they saw them. */
export function missedItems(items: DrillItem[], boxes: Record<string, number>): DrillItem[] {
  return items.filter((item) => boxes[item.id] === 1);
}

/**
 * Weighted random sample without replacement (Efraimidis–Spirakis), so low boxes come up more often.
 * Non-boss sprints then ramp from shorter to longer prompts.
 */
export function pickSprintItems(
  level: Level,
  pool: DrillItem[],
  boxes: Record<string, number>,
  random: () => number = Math.random,
): DrillItem[] {
  const chosen = pool
    .map((item) => ({ item, key: random() ** (1 / (BOX_WEIGHTS[boxOf(item.id, boxes)] ?? 1)) }))
    .sort((a, b) => b.key - a.key)
    .slice(0, level.itemCount)
    .map(({ item }) => item);

  return level.isBoss ? chosen : chosen.sort((a, b) => a.weight - b.weight);
}

export function createLevelSprint(levelIndex: number, bank: ItemBank, boxes: Record<string, number>): Sprint {
  const level = LEVELS[levelIndex];
  if (!level) {
    throw new RangeError(`There is no level ${levelIndex}.`);
  }

  return { levelIndex, level, items: pickSprintItems(level, level.pickPool(bank), boxes) };
}

export function createMissesSprint(bank: ItemBank, boxes: Record<string, number>): Sprint {
  return {
    levelIndex: null,
    level: MISSES_LEVEL,
    items: shuffled(missedItems(bank.all, boxes)).slice(0, MISSES_LEVEL.itemCount),
  };
}

export function secondsFor(item: DrillItem, level: Level): number {
  const base = LONG_ITEM_SECONDS[item.kind] ?? level.secondsPerItem ?? DEFAULT_SECONDS;

  return level.isBoss ? Math.round(base * BOSS_TIME_FACTOR) : base;
}

/** Display-only mirror of the server's combo rule. */
export function comboMultiplier(combo: number): number {
  return 1 + Math.floor(combo / 2) * 0.5;
}

export function isLongItem(item: DrillItem): boolean {
  return item.kind === "turn" || item.kind === "sen";
}
