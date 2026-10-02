import type { Progress, Settings } from "@isa-drill-room/shared";

export function createDefaultSettings(): Settings {
  return {
    enVoice: "",
    esVoice: "",
    rate: 0.95,
    typeMode: false,
    autoSpeak: true,
    micOn: true,
    esLocale: "es-MX",
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
