import type { Progress } from "@interpreting-practice/shared";
import type { ProgressRepository } from "../../src/progress/progressRepository.js";

export class InMemoryProgressRepository implements ProgressRepository {
  private readonly records = new Map<string, Progress>();

  async findByLearnerId(learnerId: string): Promise<Progress | null> {
    const progress = this.records.get(learnerId);

    return progress ? structuredClone(progress) : null;
  }

  async save(progress: Progress): Promise<Progress> {
    this.records.set(progress.learnerId, structuredClone(progress));

    return structuredClone(progress);
  }
}
