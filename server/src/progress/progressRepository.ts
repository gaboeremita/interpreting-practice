import type { Progress } from "@interpreting-practice/shared";

/** Persistence port for learner progress. The service depends on this, never on a database driver. */
export interface ProgressRepository {
  findByLearnerId(learnerId: string): Promise<Progress | null>;
  save(progress: Progress): Promise<Progress>;
}
