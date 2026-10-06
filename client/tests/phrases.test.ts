import type { DrillItem } from "@interpreting-practice/shared";
import { describe, expect, it } from "vitest";
import { buildPhrases, searchPhrases } from "../src/domain/phrases";

function item(overrides: Partial<DrillItem>): DrillItem {
  return {
    id: "sen:0",
    kind: "sen",
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
  item({ prompt: "Do you have any chest pain?", display: "¿Tiene dolor en el pecho?" }),
  item({
    id: "turn:0",
    kind: "turn",
    speaker: "Provider",
    prompt: "Take two tablets.",
    display: "Tome dos tabletas.",
  }),
  item({ id: "l4:0:en", kind: "l4", prompt: "dosage", display: "dosis" }),
];

describe("phrases", () => {
  it("keeps only sentences and turns, in source order", () => {
    expect(buildPhrases(items).map((phrase) => phrase.id)).toEqual(["sen:0", "turn:0"]);
  });

  it("searches either language ignoring accents and filters by kind", () => {
    const phrases = buildPhrases(items);
    expect(searchPhrases(phrases, "TIENE dolor", "all")).toHaveLength(1);
    expect(searchPhrases(phrases, "tabletas", "sen")).toHaveLength(0);
    expect(searchPhrases(phrases, "", "turn")).toHaveLength(1);
  });
});
