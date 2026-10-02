import type { DrillItem, Lang } from "@isa-drill-room/shared";
import type { PracticeLine } from "./data/practiceLines.js";
import { parseAcceptedOptions } from "./optionParser.js";

export interface GlossaryEntry {
  english: string;
  spanish: string;
  definition: string;
}

type TermKind = "l4" | "pain";
type LineKind = "sen" | "turn";

/**
 * Builds one item per direction for each glossary entry.
 * Ids keep the entry's position in the source list so saved review boxes survive edits elsewhere in the list.
 * Entries with no usable wording on either side are skipped because nothing could be graded.
 */
export function buildTermItems(entries: GlossaryEntry[], kind: TermKind): DrillItem[] {
  return entries.flatMap((entry, index) =>
    (["en", "es"] as const)
      .map((from) => buildTermItem(entry, kind, index, from))
      .filter((item): item is DrillItem => item !== null),
  );
}

function buildTermItem(entry: GlossaryEntry, kind: TermKind, index: number, from: Lang): DrillItem | null {
  const fromEnglish = from === "en";
  const spanishOptions = parseAcceptedOptions(entry.spanish);
  const englishOptions = parseAcceptedOptions(entry.english);
  const prompt = fromEnglish ? entry.english : spanishOptions[0];
  const accepted = fromEnglish ? spanishOptions : englishOptions;

  if (!prompt || accepted.length === 0) {
    return null;
  }

  return {
    id: `${kind}:${index}:${from}`,
    kind,
    from,
    prompt,
    accepted,
    display: fromEnglish ? entry.spanish : entry.english,
    definition: entry.definition,
    units: null,
    speaker: null,
    weight: (fromEnglish ? entry.english : entry.spanish).length,
  };
}

export function buildLineItems(lines: PracticeLine[], kind: LineKind): DrillItem[] {
  return lines.map((line, index) => ({
    id: `${kind}:${index}`,
    kind,
    from: line.from,
    prompt: line.text,
    accepted: [line.model],
    display: line.model,
    definition: "",
    units: line.units,
    speaker: line.speaker ?? null,
    weight: line.text.length,
  }));
}
