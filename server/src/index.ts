import path from "node:path";
import { createApp } from "./app.js";
import { loadEnv } from "./config/env.js";
import { ContentCatalog } from "./content/contentCatalog.js";
import { ContentService } from "./content/contentService.js";
import { MongoAnswerFixRepository } from "./content/mongoAnswerFixRepository.js";
import { connectToMongo, disconnectFromMongo } from "./db/mongo.js";
import { MongoProgressRepository } from "./progress/mongoProgressRepository.js";
import { ProgressService } from "./progress/progressService.js";
import { PiperClient } from "./voice/piperClient.js";
import { VoiceService } from "./voice/voiceService.js";

const env = loadEnv();
await connectToMongo(env.MONGODB_URI);

const catalog = ContentCatalog.fromBundledData();
const app = createApp({
  contentService: new ContentService(catalog, new MongoAnswerFixRepository()),
  progressService: new ProgressService(new MongoProgressRepository(), catalog),
  voiceService: new VoiceService(env.PIPER_TTS_URL ? new PiperClient(env.PIPER_TTS_URL) : null),
  corsOrigins: env.CORS_ORIGINS,
  clientDistPath: path.resolve(import.meta.dirname, "../../client/dist"),
});

const server = app.listen(env.PORT, () => {
  console.log(`Interpreting Practice API listening on http://localhost:${env.PORT}`);
});

function shutdown(signal: string): void {
  console.log(`${signal} received, shutting down.`);
  server.close(() => {
    void disconnectFromMongo().then(() => process.exit(0));
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
