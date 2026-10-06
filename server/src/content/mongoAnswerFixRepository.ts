import { AnswerFixModel } from "./answerFixModel.js";
import type { AnswerFixRepository } from "./answerFixRepository.js";

export class MongoAnswerFixRepository implements AnswerFixRepository {
  async findAll(): Promise<Record<string, string>> {
    const documents = await AnswerFixModel.find().lean<Array<{ itemId: string; answer: string }>>();

    return Object.fromEntries(documents.map((document) => [document.itemId, document.answer]));
  }

  async save(itemId: string, answer: string): Promise<void> {
    await AnswerFixModel.updateOne({ itemId }, { $set: { answer } }, { upsert: true, runValidators: true });
  }

  async remove(itemId: string): Promise<void> {
    await AnswerFixModel.deleteOne({ itemId });
  }
}
