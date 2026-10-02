import type { Progress, Settings } from "@isa-drill-room/shared";
import { ProgressModel } from "./progressModel.js";
import type { ProgressRepository } from "./progressRepository.js";

interface ProgressDocument {
  learnerId: string;
  xp: number;
  best?: Record<string, number>;
  boxes?: Record<string, number>;
  streak?: { last?: string; count?: number };
  scripts?: string;
  unlockAll?: boolean;
  settings: Settings;
}

export class MongoProgressRepository implements ProgressRepository {
  async findByLearnerId(learnerId: string): Promise<Progress | null> {
    const document = await ProgressModel.findOne({ learnerId }).lean<ProgressDocument>();

    return document ? toProgress(document) : null;
  }

  async save(progress: Progress): Promise<Progress> {
    const { learnerId, ...fields } = progress;
    const document = await ProgressModel.findOneAndUpdate(
      { learnerId },
      { $set: fields },
      { upsert: true, returnDocument: "after", runValidators: true },
    ).lean<ProgressDocument>();

    if (!document) {
      throw new Error(`Progress for learner ${learnerId} was not saved.`);
    }

    return toProgress(document);
  }
}

/** Maps a stored document to the API shape, dropping Mongo's own fields such as _id and timestamps. */
function toProgress(document: ProgressDocument): Progress {
  return {
    learnerId: document.learnerId,
    xp: document.xp,
    best: { ...document.best },
    boxes: { ...document.boxes },
    streak: { last: document.streak?.last ?? "", count: document.streak?.count ?? 0 },
    scripts: document.scripts ?? "",
    unlockAll: document.unlockAll ?? false,
    settings: {
      enVoice: document.settings.enVoice,
      esVoice: document.settings.esVoice,
      rate: document.settings.rate,
      typeMode: document.settings.typeMode,
      autoSpeak: document.settings.autoSpeak,
      micOn: document.settings.micOn,
      esLocale: document.settings.esLocale,
    },
  };
}
