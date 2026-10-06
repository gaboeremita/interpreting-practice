import type { DrillItem } from "@interpreting-practice/shared";
import { describe, expect, it } from "vitest";
import { buildGlossary, searchGlossary } from "../src/domain/glossary";

function item(overrides: Partial<DrillItem>): DrillItem {
  return {
    id: "l4:0:en",
    kind: "l4",
    from: "en",
    prompt: "",
    accepted: [],
    display: "",
    definition: "",
    units: null,
    speaker: null,
    weight: 1,
    ...overrides,
  };
}

const items = [
  item({ id: "l4:0:en", prompt: "dosage", display: "dosis", definition: "How much medicine to take." }),
  item({ id: "l4:0:es", from: "es", prompt: "dosis", display: "dosage" }),
  item({ id: "l4:1:en", prompt: "Acute pain", display: "dolor agudo", definition: "Very sharp pain." }),
  item({ id: "pain:0:en", kind: "pain", prompt: "Burning", display: "Ardiente, quemante" }),
  item({ id: "sen:0", kind: "sen", prompt: "Take it twice a day.", display: "Tómelo dos veces al día." }),
];

describe("buildGlossary", () => {
  it("keeps one entry per term, sorted alphabetically", () => {
    expect(buildGlossary(items).map((term) => [term.id, term.english, term.spanish])).toEqual([
      ["l4:1", "Acute pain", "dolor agudo"],
      ["pain:0", "Burning", "Ardiente, quemante"],
      ["l4:0", "dosage", "dosis"],
    ]);
  });
});

describe("searchGlossary", () => {
  const terms = buildGlossary(items);
  const ids = (query: string, kind: Parameters<typeof searchGlossary>[2] = "all") =>
    searchGlossary(terms, query, kind).map((term) => term.id);

  it("matches English, Spanish and definitions, ignoring accents and case", () => {
    expect(ids("DOSIS")).toEqual(["l4:0"]);
    expect(ids("quémante")).toEqual(["pain:0"]);
    expect(ids("sharp")).toEqual(["l4:1"]);
  });

  it("filters by kind and returns everything for an empty query", () => {
    expect(ids("", "pain")).toEqual(["pain:0"]);
    expect(ids("  ")).toHaveLength(3);
  });
});
