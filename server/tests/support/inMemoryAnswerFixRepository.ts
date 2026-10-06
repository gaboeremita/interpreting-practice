import type { AnswerFixRepository } from "../../src/content/answerFixRepository.js";

export class InMemoryAnswerFixRepository implements AnswerFixRepository {
  private readonly records = new Map<string, string>();

  async findAll(): Promise<Record<string, string>> {
    return Object.fromEntries(this.records);
  }

  async save(itemId: string, answer: string): Promise<void> {
    this.records.set(itemId, answer);
  }

  async remove(itemId: string): Promise<void> {
    this.records.delete(itemId);
  }
}
