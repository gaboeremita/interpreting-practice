import type { DrillItem } from "@isa-drill-room/shared";
import { normalize } from "../lib/text";

export type GlossaryKind = "l4" | "pain";

export interface GlossaryTerm {
  id: string;
  kind: GlossaryKind;
  english: string;
  /** The full Spanish cell, which may list several accepted renderings. */
  spanish: string;
  definition: string;
  /** English, Spanish and definition, normalized once so searching stays cheap. */
  searchText: string;
}

/** One entry per glossary term, taken from its English-to-Spanish drill item and sorted alphabetically. */
export function buildGlossary(items: readonly DrillItem[]): GlossaryTerm[] {
  return items
    .filter((item) => (item.kind === "l4" || item.kind === "pain") && item.from === "en")
    .map((item) => ({
      id: item.id.replace(/:en$/, ""),
      kind: item.kind as GlossaryKind,
      english: item.prompt,
      spanish: item.display,
      definition: item.definition,
      searchText: normalize(`${item.prompt} ${item.display} ${item.definition}`),
    }))
    .sort((a, b) => a.english.localeCompare(b.english, "en", { sensitivity: "base" }));
}

/** Matches the query in either language or the definition, ignoring case, accents and punctuation. */
export function searchGlossary(
  terms: readonly GlossaryTerm[],
  query: string,
  kind: GlossaryKind | "all",
): GlossaryTerm[] {
  const needle = normalize(query);

  return terms.filter(
    (term) => (kind === "all" || term.kind === kind) && (!needle || term.searchText.includes(needle)),
  );
}
