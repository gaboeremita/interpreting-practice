import { describe, expect, it } from "vitest";
import { parseAcceptedOptions } from "../src/content/optionParser.js";

describe("parseAcceptedOptions", () => {
  it("splits on commas, semicolons and slashes", () => {
    expect(parseAcceptedOptions("tosferina, pertusis; tos / ahogo")).toEqual([
      "tosferina",
      "pertusis",
      "tos",
      "ahogo",
    ]);
  });

  it("offers both the short and the long form of a parenthesised part", () => {
    expect(parseAcceptedOptions("(ser) alérgico")).toEqual(["alérgico", "ser alérgico"]);
  });

  it("drops bracketed editorial notes", () => {
    expect(parseAcceptedOptions("acidez estomacal, [agruras MX only]")).toEqual(["acidez estomacal"]);
  });

  it("returns nothing for an empty cell", () => {
    expect(parseAcceptedOptions("")).toEqual([]);
  });
});
