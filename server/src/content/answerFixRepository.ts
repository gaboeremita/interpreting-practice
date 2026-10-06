/** Persistence port for the learner's fixes to drill answers, keyed by item id. */
export interface AnswerFixRepository {
  findAll(): Promise<Record<string, string>>;
  save(itemId: string, answer: string): Promise<void>;
  remove(itemId: string): Promise<void>;
}
