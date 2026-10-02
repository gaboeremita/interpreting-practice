import type { Progress, SessionOutcome, SessionSubmission, Settings } from "@isa-drill-room/shared";
import { createContext } from "react";

export interface ProgressContextValue {
  progress: Progress;
  /** Last failed save, shown to the learner until the next successful one. */
  syncError: string | null;
  dismissSyncError: () => void;
  submitSession: (submission: Omit<SessionSubmission, "playedOn">) => Promise<SessionOutcome | null>;
  updateSettings: (changes: Partial<Settings>) => void;
  saveScripts: (scripts: string) => Promise<boolean>;
  setUnlockAll: (unlockAll: boolean) => void;
  resetProgress: () => Promise<boolean>;
}

export const ProgressContext = createContext<ProgressContextValue | null>(null);
