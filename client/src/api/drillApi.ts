import type {
  ContentResponse,
  Progress,
  SessionOutcome,
  SessionSubmission,
  Settings,
} from "@isa-drill-room/shared";
import { apiRequest } from "./httpClient";

const learnerPath = (learnerId: string) => `/learners/${encodeURIComponent(learnerId)}`;

export const drillApi = {
  getContent: () => apiRequest<ContentResponse>("GET", "/content"),

  getProgress: (learnerId: string) => apiRequest<Progress>("GET", `${learnerPath(learnerId)}/progress`),

  resetProgress: (learnerId: string) => apiRequest<Progress>("DELETE", `${learnerPath(learnerId)}/progress`),

  submitSession: (learnerId: string, submission: SessionSubmission) =>
    apiRequest<SessionOutcome>("POST", `${learnerPath(learnerId)}/sessions`, submission),

  updateSettings: (learnerId: string, changes: Partial<Settings>) =>
    apiRequest<Progress>("PATCH", `${learnerPath(learnerId)}/settings`, changes),

  saveScripts: (learnerId: string, scripts: string) =>
    apiRequest<Progress>("PUT", `${learnerPath(learnerId)}/scripts`, { scripts }),

  setUnlockAll: (learnerId: string, unlockAll: boolean) =>
    apiRequest<Progress>("PUT", `${learnerPath(learnerId)}/unlock-all`, { unlockAll }),
};
