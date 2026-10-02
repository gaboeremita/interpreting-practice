import { existsSync } from "node:fs";
import path from "node:path";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
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
