import type { ContentResponse, DrillItem, QuizQuestion } from "@interpreting-practice/shared";
import { z } from "zod";
import l4Corrections from "./data/l4-corrections.json" with { type: "json" };
import l4Definitions from "./data/l4-definitions.json" with { type: "json" };
import l4Glossary from "./data/l4-glossary.json" with { type: "json" };
import l4Supplement from "./data/l4-supplement.json" with { type: "json" };
import painGlossary from "./data/pain-glossary.json" with { type: "json" };
import type { PracticeLine } from "./data/practiceLines.js";
import { sentences, turns } from "./data/practiceLines.js";
import { protocolQuiz } from "./data/protocolQuiz.js";
import type { GlossaryEntry } from "./itemFactory.js";
import { buildLineItems, buildTermItems } from "./itemFactory.js";

const l4Schema = z.array(z.tuple([z.string(), z.string(), z.string()]));
const painSchema = z.array(z.tuple([z.string(), z.string()]));
/** Both sides are keyed by the English term exactly as the official list spells it. */
const correctionSchema = z.object({
  spanish: z.record(z.string(), z.string().min(1)),
  english: z.record(z.string(), z.string().min(1)),
});
const definitionSchema = z.record(z.string(), z.string().min(1));
const supplementSchema = z.record(z.string(), z.string().min(1));

/** Read-only store of every drill item and quiz question the app serves. */
export class ContentCatalog {
  private readonly itemIds: Set<string>;

  constructor(
    private readonly items: DrillItem[],
    private readonly quiz: QuizQuestion[],
  ) {
    this.itemIds = new Set(items.map((item) => item.id));
  }

  /**
   * Validates the bundled data files once at startup so a broken edit fails fast.
   * L4 entries the official list leaves untranslated take their Spanish from l4-supplement.json
   * and their missing definitions from l4-definitions.json.
   * Wording the official list gets wrong, on either side, is replaced from l4-corrections.json.
   * The learner's own fixes, keyed by item id, replace an item's answer and mark the item with the original.
   */
  static fromBundledData(answerFixes: Readonly<Record<string, string>> = {}): ContentCatalog {
    const original = buildBundledItems({});
    if (Object.keys(answerFixes).length === 0) {
      return new ContentCatalog(original, protocolQuiz);
    }

    const originalById = new Map(original.map((item) => [item.id, item]));
    const fixed = buildBundledItems(answerFixes).map((item) =>
      item.id in answerFixes ? { ...item, original: originalById.get(item.id)?.display } : item,
    );

    return new ContentCatalog(fixed, protocolQuiz);
  }

  getContent(): ContentResponse {
    return { items: this.items, quiz: this.quiz };
  }

  hasItem(itemId: string): boolean {
    return this.itemIds.has(itemId);
  }

  findUnknownItemIds(itemIds: string[]): string[] {
    return itemIds.filter((itemId) => !this.itemIds.has(itemId));
  }
}

/**
 * A term item's answer is one side of its glossary entry, so a fix to "l4:5:en" changes the entry's Spanish
 * and a fix to "l4:5:es" its English, in both drill directions.
 */
function buildBundledItems(answerFixes: Readonly<Record<string, string>>): DrillItem[] {
  const corrections = correctionSchema.parse(l4Corrections);
  const supplement = supplementSchema.parse(l4Supplement);
  const definitions = definitionSchema.parse(l4Definitions);
  const l4Entries: GlossaryEntry[] = l4Schema.parse(l4Glossary).map(([english, spanish, definition]) => ({
    english: corrections.english[english] ?? english,
    spanish: corrections.spanish[english] ?? (spanish.trim() || (supplement[english] ?? "")),
    definition: definition.trim() || (definitions[english] ?? ""),
  }));
  const painEntries: GlossaryEntry[] = painSchema
    .parse(painGlossary)
    .map(([english, spanish]) => ({ english, spanish, definition: "" }));

  return [
    ...buildTermItems(l4Entries.map(fixEntry("l4")), "l4"),
    ...buildTermItems(painEntries.map(fixEntry("pain")), "pain"),
    ...buildLineItems(sentences.map(fixLine("sen")), "sen"),
    ...buildLineItems(turns.map(fixLine("turn")), "turn"),
  ];

  function fixEntry(kind: string) {
    return (entry: GlossaryEntry, index: number): GlossaryEntry => ({
      ...entry,
      english: answerFixes[`${kind}:${index}:es`] ?? entry.english,
      spanish: answerFixes[`${kind}:${index}:en`] ?? entry.spanish,
    });
  }

  function fixLine(kind: string) {
    return (line: PracticeLine, index: number): PracticeLine => ({
      ...line,
      model: answerFixes[`${kind}:${index}`] ?? line.model,
    });
  }
}
