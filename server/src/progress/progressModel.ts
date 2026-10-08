import { model, Schema } from "mongoose";

const settingsSchema = new Schema(
  {
    voiceSource: { type: String, enum: ["browser", "piper"], default: "browser" },
    enVoice: { type: String, default: "" },
    esVoice: { type: String, default: "" },
    rate: { type: Number, default: 0.95 },
    typeMode: { type: Boolean, default: false },
    autoSpeak: { type: Boolean, default: true },
    micOn: { type: Boolean, default: true },
    esLocale: { type: String, enum: ["es-MX", "es-US"], default: "es-MX" },
    sprintLength: { type: String, enum: ["short", "standard", "long"], default: "standard" },
    itemCounts: { type: Map, of: Number, default: {} },
  },
  { _id: false },
);

const progressSchema = new Schema(
  {
    learnerId: { type: String, required: true, unique: true, index: true },
    xp: { type: Number, default: 0 },
    best: { type: Map, of: Number, default: {} },
    boxes: { type: Map, of: Number, default: {} },
    streak: {
      last: { type: String, default: "" },
      count: { type: Number, default: 0 },
    },
    scripts: { type: String, default: "" },
    unlockAll: { type: Boolean, default: false },
    settings: { type: settingsSchema, default: () => ({}) },
  },
  { timestamps: true },
);

export const ProgressModel = model("Progress", progressSchema);
