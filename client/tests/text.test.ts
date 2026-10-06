import { describe, expect, it } from "vitest";
import {
  checkAnswer,
  checkAnyAnswer,
  displayOptions,
  firstWording,
  initialsOf,
  normalize,
  unitWasRendered,
} from "../src/lib/text";

describe("normalize", () => {
  it("strips accents and punctuation and turns number words into digits", () => {
    expect(normalize("¿Tiene DOLOR en el pecho?")).toBe("tiene dolor en el pecho");
    expect(normalize("cada ocho horas")).toBe("cada 8 horas");
  });
});

describe("checkAnswer", () => {
  const accepted = ["dolor en el pecho"];

  it("accepts the exact wording regardless of accents and case", () => {
    expect(checkAnswer("Dolor en el pecho", accepted)).toBe("got");
  });

  it("accepts an answer that contains the term as a whole phrase", () => {
    expect(checkAnswer("es dolor en el pecho", accepted)).toBe("got");
  });

  it("calls a small slip close and anything else a miss", () => {
    expect(checkAnswer("dolor en el pecha", accepted)).toBe("close");
    expect(checkAnswer("dolor de cabeza", accepted)).toBe("miss");
  });

  it("returns null when nothing was said", () => {
    expect(checkAnswer("  ", accepted)).toBeNull();
  });
});

describe("checkAnyAnswer", () => {
  it("keeps the best verdict across recognizer alternatives", () => {
    expect(checkAnyAnswer(["dolor de cabeza", "dolor en el pecho"], ["dolor en el pecho"])).toBe("got");
  });
});

describe("unitWasRendered", () => {
  it("matches units by their content words, digits included", () => {
    expect(unitWasRendered("cada ocho horas", "tome dos tabletas cada 8 horas")).toBe(true);
    expect(unitWasRendered("con alimentos", "tome dos tabletas")).toBe(false);
  });
});

describe("initialsOf", () => {
  it("keeps the first letter of each word and the punctuation", () => {
    expect(initialsOf("Hello, my name is Ana.")).toBe("H, m n i A.");
  });
});

describe("displayOptions", () => {
  it("keeps a word swap inside one option and splits on spaced slashes", () => {
    expect(displayOptions("Prueba/examen de Fenilcetonuria")).toEqual(["Prueba/examen de Fenilcetonuria"]);
    expect(displayOptions("whooping cough / pertussis, tos ferina")).toEqual([
      "whooping cough",
      "pertussis",
      "tos ferina",
    ]);
  });
});

describe("firstWording", () => {
  it("keeps the first choice of each word swap", () => {
    expect(firstWording("Prueba/examen de Fenilcetonuria")).toBe("Prueba de Fenilcetonuria");
    expect(firstWording("Electrocardiogram (ECG/EKG)")).toBe("Electrocardiogram (ECG)");
  });
});
