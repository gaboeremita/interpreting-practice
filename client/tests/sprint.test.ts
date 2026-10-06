import type { DrillItem } from "@interpreting-practice/shared";
import { describe, expect, it } from "vitest";
import { buildItemBank } from "../src/domain/itemBank";
import { isLevelUnlocked, LEVELS, nextLevelIndex } from "../src/domain/levels";
import { missedItems, pickSprintItems, secondsFor } from "../src/domain/sprint";

function makeItem(id: string, overrides: Partial<DrillItem> = {}): DrillItem {
  return {
    id,
    kind: "l4",
    from: "en",
    prompt: id,
    accepted: ["x"],
    display: "x",
    definition: "",
    units: null,
    speaker: null,
    weight: id.length,
    ...overrides,
  };
}

const [warmUp, , , , , , turns, boss] = LEVELS;

describe("pickSprintItems", () => {
  const pool = Array.from({ length: 30 }, (_, i) => makeItem(`item-${i}`, { weight: 30 - i }));

  it("picks the level's item count and ramps from short to long", () => {
    const picked = pickSprintItems(warmUp!, pool, {});
    expect(picked).toHaveLength(warmUp!.itemCount);
    expect(picked.map((item) => item.weight)).toEqual(
      [...picked.map((item) => item.weight)].sort((a, b) => a - b),
    );
  });

  it("favours items in low Leitner boxes", () => {
    const boxes = Object.fromEntries(pool.map((item) => [item.id, 5]));
    boxes["item-7"] = 1;
    let hits = 0;
    for (let run = 0; run < 200; run++) {
      if (pickSprintItems(warmUp!, pool, boxes).some((item) => item.id === "item-7")) {
        hits++;
      }
    }
    expect(hits).toBeGreaterThan(180);
  });
});

describe("secondsFor", () => {
  it("gives long items their own time and the boss call 25% less", () => {
    const turn = makeItem("t", { kind: "turn" });
    expect(secondsFor(turn, turns!)).toBe(40);
    expect(secondsFor(turn, boss!)).toBe(30);
    expect(secondsFor(makeItem("term"), boss!)).toBe(5);
  });
});

describe("missedItems", () => {
  it("returns items whose last grade sent them to box 1", () => {
    const items = [makeItem("a"), makeItem("b"), makeItem("c")];
    expect(missedItems(items, { a: 1, b: 3 }).map((item) => item.id)).toEqual(["a"]);
  });
});

describe("ladder unlocking", () => {
  it("opens a rung once the previous one is passed", () => {
    expect(isLevelUnlocked(0, {}, false)).toBe(true);
    expect(isLevelUnlocked(1, { "0": 0.7 }, false)).toBe(false);
    expect(isLevelUnlocked(1, { "0": 0.8 }, false)).toBe(true);
    expect(isLevelUnlocked(5, {}, true)).toBe(true);
  });

  it("suggests the first open rung that isn't passed", () => {
    expect(nextLevelIndex({}, false)).toBe(0);
    expect(nextLevelIndex({ "0": 0.9, "1": 0.5 }, false)).toBe(1);
  });
});

describe("buildItemBank", () => {
  it("sorts items into pools by kind and direction", () => {
    const bank = buildItemBank([
      makeItem("l4:0:en", { prompt: "chills", accepted: ["escalofríos"] }),
      makeItem("l4:0:es", { from: "es" }),
      makeItem("pain:0:en", { kind: "pain" }),
      makeItem("turn:0", { kind: "turn" }),
    ]);

    expect(bank.l4FromEnglish).toHaveLength(1);
    expect(bank.l4FromSpanish).toHaveLength(1);
    expect(bank.warmUp.map((item) => item.prompt)).toEqual(["chills"]);
    expect(bank.pain).toHaveLength(1);
    expect(bank.turns).toHaveLength(1);
  });
});
