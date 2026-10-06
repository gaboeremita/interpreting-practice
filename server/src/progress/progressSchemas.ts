import { z } from "zod";

export const learnerParamsSchema = z.object({
  learnerId: z.uuid(),
});

const gradeSchema = z.enum(["got", "close", "miss"]);

export const sessionSubmissionSchema = z
  .object({
    levelIndex: z.number().int().min(0).max(50).nullable(),
    plannedCount: z.number().int().min(1).max(100),
    scoreUnplayed: z.boolean(),
    results: z
      .array(z.object({ itemId: z.string().min(1).max(64), grade: gradeSchema }))
      .min(1)
      .max(100),
    playedOn: z.iso.date(),
  })
  .refine((submission) => submission.results.length <= submission.plannedCount, {
    message: "There are more results than planned items.",
    path: ["results"],
  });

export const settingsChangesSchema = z
  .object({
    voiceSource: z.enum(["browser", "piper"]),
    enVoice: z.string().max(200),
    esVoice: z.string().max(200),
    rate: z.number().min(0.7).max(1.3),
    typeMode: z.boolean(),
    autoSpeak: z.boolean(),
    micOn: z.boolean(),
    esLocale: z.enum(["es-MX", "es-US"]),
  })
  .partial()
  .strict();

export const scriptsSchema = z.object({
  scripts: z.string().max(20_000),
});

export const unlockAllSchema = z.object({
  unlockAll: z.boolean(),
});
