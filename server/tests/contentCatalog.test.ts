import { describe, expect, it } from "vitest";
import { ContentCatalog } from "../src/content/contentCatalog.js";

describe("ContentCatalog.fromBundledData", () => {
  const { items, quiz } = ContentCatalog.fromBundledData().getContent();

  it("gives every item a unique id", () => {
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
  });

  it("skips glossary entries that have no translation", () => {
    expect(items.find((item) => item.prompt === "cystitis")).toBeUndefined();
    expect(items.every((item) => item.accepted.length > 0)).toBe(true);
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
