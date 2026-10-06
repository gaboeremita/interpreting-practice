import { describe, expect, it } from "vitest";
import { ContentCatalog } from "../src/content/contentCatalog.js";
import l4Corrections from "../src/content/data/l4-corrections.json" with { type: "json" };
import l4Glossary from "../src/content/data/l4-glossary.json" with { type: "json" };
import l4Supplement from "../src/content/data/l4-supplement.json" with { type: "json" };

describe("ContentCatalog.fromBundledData", () => {
  const { items, quiz } = ContentCatalog.fromBundledData().getContent();

  it("gives every item a unique id", () => {
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
  });

  it("drills every L4 term in both directions", () => {
    const l4Items = items.filter((item) => item.kind === "l4");
    expect(l4Items).toHaveLength(l4Glossary.length * 2);
    expect(items.every((item) => item.accepted.length > 0)).toBe(true);
  });

  it("fills untranslated L4 terms from the supplement", () => {
    expect(items.find((item) => item.prompt === "cystitis")?.accepted).toEqual(["cistitis"]);
    expect(items.find((item) => item.id === "l4:91:es")?.prompt).toBe("cistitis");
  });

  it("replaces wrong official wording with the correction", () => {
    expect(items.find((item) => item.prompt === "oncology")?.accepted).toEqual(["oncología"]);
  });

  it("applies a learner's fix to both directions of a term", () => {
    const fixedItems = ContentCatalog.fromBundledData({
      "sen:0": "¿Le duele el pecho?",
      "l4:0:es": "acid reflux disease",
    }).getContent().items;
    const byId = (id: string) => fixedItems.find((item) => item.id === id);

    expect(byId("sen:0")?.accepted).toEqual(["¿Le duele el pecho?"]);
    expect(byId("sen:0")?.original).toBe("¿Tiene dolor en el pecho?");
    expect(byId("l4:0:es")?.accepted).toEqual(["acid reflux disease"]);
    expect(byId("l4:0:en")?.prompt).toBe("acid reflux disease");
    expect(byId("l4:0:en")?.original).toBeUndefined();
  });

  it("only corrects terms that are on the official list", () => {
    const english = new Set(l4Glossary.map(([term]) => term));
    const corrected = [...Object.keys(l4Corrections.spanish), ...Object.keys(l4Corrections.english)];
    expect(corrected.filter((term) => !english.has(term))).toEqual([]);
  });

  it("replaces wrong official English wording with the correction", () => {
    expect(items.find((item) => item.id === "l4:81:es")?.accepted).toEqual([
      "contraception",
      "birth control",
    ]);
  });

  it("only supplements terms the official list leaves untranslated", () => {
    const untranslated = new Set(
      l4Glossary.filter(([, spanish]) => !spanish?.trim()).map(([english]) => english),
    );
    expect(new Set(Object.keys(l4Supplement))).toEqual(untranslated);
  });

  it("gives every L4 term a definition", () => {
    const missing = items.filter((item) => item.kind === "l4" && !item.definition.trim());
    expect(missing.map((item) => item.prompt)).toEqual([]);
  });

  it("builds both directions for a term", () => {
    const chills = items.filter((item) => item.id.startsWith("l4:") && item.display.includes("chills"));
    expect(chills.map((item) => item.from)).toContain("es");
    expect(items.find((item) => item.prompt === "chills")?.accepted).toEqual(["escalofríos"]);
  });

  it("serves practice lines with units and the quiz", () => {
    expect(items.filter((item) => item.kind === "turn").every((item) => (item.units?.length ?? 0) > 0)).toBe(
      true,
    );
    expect(quiz.length).toBeGreaterThan(0);
  });
});
