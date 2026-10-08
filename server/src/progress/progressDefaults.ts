import type { Progress, Settings } from "@interpreting-practice/shared";

export function createDefaultSettings(): Settings {
  return {
    voiceSource: "browser",
    enVoice: "",
    esVoice: "",
    rate: 0.95,
    typeMode: false,
    autoSpeak: true,
    micOn: true,
    esLocale: "es-MX",
    sprintLength: "standard",
    itemCounts: {},
  };
}

export function createEmptyProgress(learnerId: string): Progress {
  return {
    learnerId,
    xp: 0,
    best: {},
    boxes: {},
    streak: { last: "", count: 0 },
    scripts: "",
    unlockAll: false,
    settings: createDefaultSettings(),
  };
}
