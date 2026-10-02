import type { Progress, SessionOutcome, SessionSubmission, Settings } from "@isa-drill-room/shared";
import type { ContentCatalog } from "../content/contentCatalog.js";
import { ValidationError } from "../errors.js";
import { createEmptyProgress } from "./progressDefaults.js";
import type { ProgressRepository } from "./progressRepository.js";
import { MIN_BOX, nextBox, nextStreak, sessionScore, xpForGrades } from "./progressRules.js";

export class ProgressService {
  constructor(
    private readonly repository: ProgressRepository,
    private readonly catalog: ContentCatalog,
  ) {}

  /** A learner with nothing saved yet gets fresh progress; it is stored on their first change. */
  async get(learnerId: string): Promise<Progress> {
    return (await this.repository.findByLearnerId(learnerId)) ?? createEmptyProgress(learnerId);
  }

  async recordSession(learnerId: string, submission: SessionSubmission): Promise<SessionOutcome> {
    const unknownIds = this.catalog.findUnknownItemIds(submission.results.map((result) => result.itemId));
    if (unknownIds.length > 0) {
      throw new ValidationError("The sprint contains items that don't exist.", { unknownIds });
    }

    const grades = submission.results.map((result) => result.grade);
    const score = sessionScore(grades, submission.plannedCount, submission.scoreUnplayed);
    const xpEarned = xpForGrades(grades);
    const levelKey = submission.levelIndex === null ? null : String(submission.levelIndex);
    let previousBest = 0;

    const progress = await this.mutate(learnerId, (draft) => {
      for (const { itemId, grade } of submission.results) {
        draft.boxes[itemId] = nextBox(draft.boxes[itemId] ?? MIN_BOX, grade);
      }
      draft.xp += xpEarned;
      draft.streak = nextStreak(draft.streak, submission.playedOn);

      if (levelKey !== null) {
        previousBest = draft.best[levelKey] ?? 0;
        draft.best[levelKey] = Math.max(previousBest, score);
      }
    });

    return { progress, score, previousBest, xpEarned };
  }

  async updateSettings(learnerId: string, changes: Partial<Settings>): Promise<Progress> {
    return this.mutate(learnerId, (draft) => {
      draft.settings = { ...draft.settings, ...changes };
    });
  }

  async saveScripts(learnerId: string, scripts: string): Promise<Progress> {
    return this.mutate(learnerId, (draft) => {
      draft.scripts = scripts;
    });
  }

  async setUnlockAll(learnerId: string, unlockAll: boolean): Promise<Progress> {
    return this.mutate(learnerId, (draft) => {
      draft.unlockAll = unlockAll;
    });
  }

  /** Wipes scores and review boxes. Saved scripts and settings are kept. */
  async reset(learnerId: string): Promise<Progress> {
    return this.mutate(learnerId, (draft) => {
      const empty = createEmptyProgress(learnerId);
      draft.xp = empty.xp;
      draft.best = empty.best;
      draft.boxes = empty.boxes;
      draft.streak = empty.streak;
      draft.unlockAll = empty.unlockAll;
    });
  }

  private async mutate(learnerId: string, change: (draft: Progress) => void): Promise<Progress> {
    const draft = structuredClone(await this.get(learnerId));
    change(draft);

    return this.repository.save(draft);
  }
}
