import path from "node:path";
import { createApp } from "./app.js";
import { loadEnv } from "./config/env.js";
import { ContentCatalog } from "./content/contentCatalog.js";
import { connectToMongo, disconnectFromMongo } from "./db/mongo.js";
import { MongoProgressRepository } from "./progress/mongoProgressRepository.js";
import { ProgressService } from "./progress/progressService.js";

const env = loadEnv();
await connectToMongo(env.MONGODB_URI);

const catalog = ContentCatalog.fromBundledData();
const app = createApp({
  catalog,
  progressService: new ProgressService(new MongoProgressRepository(), catalog),
  corsOrigins: env.CORS_ORIGINS,
  clientDistPath: path.resolve(import.meta.dirname, "../../client/dist"),
});

const server = app.listen(env.PORT, () => {
  console.log(`ISA Drill Room API listening on http://localhost:${env.PORT}`);
});

function shutdown(signal: string): void {
  console.log(`${signal} received, shutting down.`);
  server.close(() => {
    void disconnectFromMongo().then(() => process.exit(0));
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
