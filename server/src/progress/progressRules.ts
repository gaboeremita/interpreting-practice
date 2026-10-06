import type { Grade, Streak } from "@interpreting-practice/shared";

export const MIN_BOX = 1;
export const MAX_BOX = 5;
const MAX_COMBO = 8;
const BASE_XP = 10;

/** Leitner rule: a hit moves the item up one box, a close call keeps it, a miss sends it back to box 1. */
export function nextBox(currentBox: number, grade: Grade): number {
  if (grade === "got") {
    return Math.min(currentBox + 1, MAX_BOX);
  }

  return grade === "close" ? currentBox : MIN_BOX;
}

export function gradeValue(grade: Grade): number {
  return { got: 1, close: 0.5, miss: 0 }[grade];
}

/** Every two hits in a row add 0.5 to the multiplier, up to 5×. Anything but a hit breaks the combo. */
export function xpForGrades(grades: Grade[]): number {
  let combo = 0;

  return grades.reduce((total, grade) => {
    combo = grade === "got" ? Math.min(combo + 1, MAX_COMBO) : 0;
    const multiplier = 1 + Math.floor(combo / 2) * 0.5;

    return total + Math.round(gradeValue(grade) * BASE_XP * multiplier);
  }, 0);
}

/**
 * Average value of the sprint, from 0 to 1.
 * Boss sprints count items the learner never reached (they ran out of lives) as misses.
 */
export function sessionScore(grades: Grade[], plannedCount: number, scoreUnplayed: boolean): number {
  const total = grades.reduce((sum, grade) => sum + gradeValue(grade), 0);
  const denominator = scoreUnplayed ? plannedCount : grades.length;

  return total / Math.max(denominator, 1);
}

/** Dates are the learner's local calendar day as YYYY-MM-DD. */
export function nextStreak(streak: Streak, playedOn: string): Streak {
  if (streak.last === playedOn) {
    return streak;
  }

  const count = streak.last === previousDay(playedOn) ? streak.count + 1 : 1;

  return { last: playedOn, count };
}

export function previousDay(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, (day ?? 1) - 1));

  return date.toISOString().slice(0, 10);
}
