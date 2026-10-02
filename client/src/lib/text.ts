import type { Grade } from "@isa-drill-room/shared";

/** Speech recognition returns "2" or "dos" unpredictably, so number words are normalized to digits. */
const NUMBER_WORDS: Record<string, number> = {
  cero: 0,
  zero: 0,
  uno: 1,
  una: 1,
  one: 1,
  dos: 2,
  two: 2,
  tres: 3,
  three: 3,
  cuatro: 4,
  four: 4,
  cinco: 5,
  five: 5,
  seis: 6,
  six: 6,
  siete: 7,
  seven: 7,
  ocho: 8,
  eight: 8,
  nueve: 9,
  nine: 9,
  diez: 10,
  ten: 10,
  doce: 12,
  twelve: 12,
  quince: 15,
  fifteen: 15,
  veinte: 20,
  twenty: 20,
  treinta: 30,
  thirty: 30,
  cuarenta: 40,
  forty: 40,
  cincuenta: 50,
  fifty: 50,
  cien: 100,
};

const CLOSE_MATCH_TOLERANCE = 0.15;
const UNIT_WORD_COVERAGE = 0.7;

/** Lowercases, strips accents, punctuation and bracketed notes, and turns number words into digits. */
export function normalize(text: string): string {
  const base = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/[¿?¡!.,;:"“”'’()\-…]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return base
    .split(" ")
    .map((word) => (word in NUMBER_WORDS ? String(NUMBER_WORDS[word]) : word))
    .join(" ");
}

/** Levenshtein edit distance. */
export function editDistance(a: string, b: string): number {
  if (!a.length || !b.length) {
    return Math.max(a.length, b.length);
  }

  let previous = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      const substitution = (previous[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1);
      current[j] = Math.min((previous[j] ?? 0) + 1, (current[j - 1] ?? 0) + 1, substitution);
    }
    previous = current;
  }

  return previous[b.length] ?? 0;
}

/**
 * "got" for an exact match (ignoring accents and punctuation) or an answer that contains the term as a whole phrase,
 * "close" for a small slip, "miss" otherwise, and null when there is nothing to check.
 */
export function checkAnswer(answer: string, accepted: string[]): Grade | null {
  const said = normalize(answer);
  if (!said) {
    return null;
  }

  let bestRatio = Infinity;
  for (const option of accepted) {
    const expected = normalize(option);
    if (said === expected || (expected.length >= 3 && ` ${said} `.includes(` ${expected} `))) {
      return "got";
    }
    bestRatio = Math.min(bestRatio, editDistance(said, expected) / Math.max(expected.length, 1));
  }

  return bestRatio <= CLOSE_MATCH_TOLERANCE ? "close" : "miss";
}

const GRADE_RANK: Record<Grade, number> = { got: 3, close: 2, miss: 1 };

/** Picks the best verdict across several candidate transcripts from the recognizer. */
export function checkAnyAnswer(candidates: string[], accepted: string[]): Grade | null {
  let best: Grade | null = null;
  for (const candidate of candidates) {
    const grade = candidate ? checkAnswer(candidate, accepted) : null;
    if (grade && (!best || GRADE_RANK[grade] > GRADE_RANK[best])) {
      best = grade;
    }
  }

  return best;
}

/** A unit counts as rendered when about 70% of its content words show up in what was said. */
export function unitWasRendered(unit: string, said: string): boolean {
  const words = normalize(unit.replace(/\([^)]*\)/g, ""))
    .split(" ")
    .filter((word) => word.length > 2 || /\d/.test(word));
  const heard = normalize(said).split(" ");
  if (!words.length || !said) {
    return false;
  }

  const hits = words.filter((word) =>
    heard.some((heardWord) => heardWord === word || (word.length >= 5 && editDistance(heardWord, word) <= 1)),
  ).length;

  return hits / words.length >= UNIT_WORD_COVERAGE;
}

/** "Hello, my name is Ana" → "H, m n i A": first letter of each word, punctuation kept. */
export function initialsOf(line: string): string {
  return line
    .split(/\s+/)
    .map((word) => word.replace(/^([^\p{L}\p{N}#]*[\p{L}\p{N}#])[\p{L}\p{N}'’-]*/u, "$1"))
    .join(" ");
}

/** Number of words that differ, position by position, between the expected line and an attempt. */
export function countWrongWords(expected: string, attempt: string): number {
  const expectedWords = normalize(expected).split(" ");
  const attemptWords = normalize(attempt).split(" ");

  return expectedWords.filter((word, index) => attemptWords[index] !== word).length;
}

/** Splits a glossary cell for display, e.g. "urticaria, ronchas" → ["urticaria", "ronchas"]. */
export function displayOptions(display: string): string[] {
  return display
    .split(/[,;/]/)
    .map((option) => option.trim())
    .filter(Boolean);
}
