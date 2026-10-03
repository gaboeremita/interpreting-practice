import type { ContentResponse, DrillItem, QuizQuestion } from "@isa-drill-room/shared";
import { z } from "zod";
import l4Glossary from "./data/l4-glossary.json" with { type: "json" };
import l4Supplement from "./data/l4-supplement.json" with { type: "json" };
import painGlossary from "./data/pain-glossary.json" with { type: "json" };
import { sentences, turns } from "./data/practiceLines.js";
import { protocolQuiz } from "./data/protocolQuiz.js";
import type { GlossaryEntry } from "./itemFactory.js";
import { buildLineItems, buildTermItems } from "./itemFactory.js";

const l4Schema = z.array(z.tuple([z.string(), z.string(), z.string()]));
const painSchema = z.array(z.tuple([z.string(), z.string()]));
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
   * L4 entries the official list leaves untranslated take their Spanish from l4-supplement.json.
   */
  static fromBundledData(): ContentCatalog {
    const supplement = supplementSchema.parse(l4Supplement);
    const l4Entries: GlossaryEntry[] = l4Schema.parse(l4Glossary).map(([english, spanish, definition]) => ({
      english,
      spanish: spanish.trim() || (supplement[english] ?? ""),
      definition,
    }));
    const painEntries: GlossaryEntry[] = painSchema
      .parse(painGlossary)
      .map(([english, spanish]) => ({ english, spanish, definition: "" }));

    return new ContentCatalog(
      [
        ...buildTermItems(l4Entries, "l4"),
        ...buildTermItems(painEntries, "pain"),
        ...buildLineItems(sentences, "sen"),
        ...buildLineItems(turns, "turn"),
      ],
      protocolQuiz,
    );
  }

  getContent(): ContentResponse {
    return { items: this.items, quiz: this.quiz };
  }

  findUnknownItemIds(itemIds: string[]): string[] {
    return itemIds.filter((itemId) => !this.itemIds.has(itemId));
  }
}
