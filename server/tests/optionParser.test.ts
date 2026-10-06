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

  it("swaps just the word when a slash sits between two words", () => {
    expect(parseAcceptedOptions("Prueba/examen de Fenilcetonuria")).toEqual([
      "Prueba de Fenilcetonuria",
      "examen de Fenilcetonuria",
    ]);
    expect(parseAcceptedOptions("blood sample/test/specimen")).toEqual([
      "blood sample",
      "blood test",
      "blood specimen",
    ]);
  });

  it("treats a slash with a space beside it as a separator between wordings", () => {
    expect(parseAcceptedOptions("Candidiasis/ infección de hongos")).toEqual([
      "Candidiasis",
      "infección de hongos",
    ]);
  });

  it("pairs swaps that offer the same number of choices", () => {
    expect(parseAcceptedOptions("Sexually Transmitted Infection/Disease (STI/STD)")).toEqual([
      "Sexually Transmitted Infection",
      "Sexually Transmitted Infection STI",
      "Sexually Transmitted Disease",
      "Sexually Transmitted Disease STD",
    ]);
  });

  it("reads a bare gender ending as the other form of the word", () => {
    expect(parseAcceptedOptions("baja/o en sodio")).toEqual(["baja en sodio", "bajo en sodio"]);
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
