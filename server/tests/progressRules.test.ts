import { describe, expect, it } from "vitest";
import {
  nextBox,
  nextStreak,
  previousDay,
  sessionScore,
  xpForGrades,
} from "../src/progress/progressRules.js";

describe("nextBox", () => {
  it("moves up on a hit, stays on a close call, resets on a miss", () => {
    expect(nextBox(2, "got")).toBe(3);
    expect(nextBox(5, "got")).toBe(5);
    expect(nextBox(3, "close")).toBe(3);
    expect(nextBox(4, "miss")).toBe(1);
  });
});

describe("xpForGrades", () => {
  it("rewards combos of consecutive hits", () => {
    expect(xpForGrades(["got"])).toBe(10);
    expect(xpForGrades(["got", "got"])).toBe(25);
    expect(xpForGrades(["got", "miss", "got"])).toBe(20);
    expect(xpForGrades(["close"])).toBe(5);
  });
});

describe("sessionScore", () => {
  it("averages the played items", () => {
    expect(sessionScore(["got", "close", "miss", "got"], 10, false)).toBe(0.625);
  });

  it("counts unplayed items as misses when asked", () => {
    expect(sessionScore(["got", "got"], 4, true)).toBe(0.5);
  });
});

describe("nextStreak", () => {
  it("continues on the next day, restarts after a gap, ignores the same day", () => {
    expect(nextStreak({ last: "2026-02-28", count: 3 }, "2026-03-01")).toEqual({
      last: "2026-03-01",
      count: 4,
    });
    expect(nextStreak({ last: "2026-02-20", count: 3 }, "2026-03-01")).toEqual({
      last: "2026-03-01",
      count: 1,
    });
    expect(nextStreak({ last: "2026-03-01", count: 3 }, "2026-03-01")).toEqual({
      last: "2026-03-01",
      count: 3,
    });
  });

  it("finds the previous day across month and year boundaries", () => {
    expect(previousDay("2026-01-01")).toBe("2025-12-31");
    expect(previousDay("2028-03-01")).toBe("2028-02-29");
  });
});
