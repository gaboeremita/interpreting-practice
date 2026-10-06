import { existsSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

/** Blank values count as unset, so `.env` files can list the variable without enabling it. */
const optionalUrl = z.preprocess((value) => (value === "" ? undefined : value), z.url().optional());

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65_535).default(4004),
  MONGODB_URI: z.string().startsWith("mongodb"),
  CORS_ORIGINS: z
    .string()
    .default("")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
  PIPER_TTS_URL: optionalUrl,
});

export type Env = z.infer<typeof envSchema>;

/** Reads the repository root .env when present (local development); containers pass real variables instead. */
export function loadEnv(): Env {
  const envFile = path.resolve(import.meta.dirname, "../../../.env");
  if (existsSync(envFile)) {
    process.loadEnvFile(envFile);
  }

  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const problems = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    throw new Error(`Invalid environment variables:\n${problems.join("\n")}`);
  }

  return result.data;
}
