import type { DrillItem, Lang, Speaker } from "@interpreting-practice/shared";
import { normalize } from "../lib/text";

export type PhraseKind = "sen" | "turn";

export interface Phrase {
  id: string;
  kind: PhraseKind;
  /** The language the drill speaks; the model rendering is in the other one. */
  from: Lang;
  speaker: Speaker | null;
  prompt: string;
  model: string;
  /** Both wordings, normalized once so searching stays cheap. */
  searchText: string;
}

/** One entry per practice line, in the order the drills define them. */
export function buildPhrases(items: readonly DrillItem[]): Phrase[] {
  return items
    .filter((item) => item.kind === "sen" || item.kind === "turn")
    .map((item) => ({
      id: item.id,
      kind: item.kind as PhraseKind,
      from: item.from,
      speaker: item.speaker,
      prompt: item.prompt,
      model: item.display,
      searchText: normalize(`${item.prompt} ${item.display}`),
    }));
}

/** Matches the query in either language, ignoring case, accents and punctuation. */
export function searchPhrases(phrases: readonly Phrase[], query: string, kind: PhraseKind | "all"): Phrase[] {
  const needle = normalize(query);

  return phrases.filter(
    (phrase) => (kind === "all" || phrase.kind === kind) && (!needle || phrase.searchText.includes(needle)),
  );
}
