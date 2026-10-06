import type { ContentResponse } from "@interpreting-practice/shared";
import { NotFoundError } from "../errors.js";
import type { AnswerFixRepository } from "./answerFixRepository.js";
import { ContentCatalog } from "./contentCatalog.js";

/** Serves the drill content with the learner's answer fixes applied, rebuilding it whenever a fix changes. */
export class ContentService {
  private catalog: ContentCatalog | null = null;

  constructor(
    private readonly bundled: ContentCatalog,
    private readonly fixes: AnswerFixRepository,
  ) {}

  async getContent(): Promise<ContentResponse> {
    this.catalog ??= ContentCatalog.fromBundledData(await this.fixes.findAll());

    return this.catalog.getContent();
  }

  /** Saving the bundled answer again simply drops the fix. */
  async fixAnswer(itemId: string, answer: string): Promise<ContentResponse> {
    const original = this.bundledAnswerOf(itemId);
    if (answer === original) {
      await this.fixes.remove(itemId);
    } else {
      await this.fixes.save(itemId, answer);
    }
    this.catalog = null;

    return this.getContent();
  }

  async restoreAnswer(itemId: string): Promise<ContentResponse> {
    this.bundledAnswerOf(itemId);
    await this.fixes.remove(itemId);
    this.catalog = null;

    return this.getContent();
  }

  private bundledAnswerOf(itemId: string): string {
    const item = this.bundled.getContent().items.find((candidate) => candidate.id === itemId);
    if (!item) {
      throw new NotFoundError(`There is no drill item ${itemId}.`);
    }

    return item.display;
  }
}
