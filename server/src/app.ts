import { existsSync } from "node:fs";
import path from "node:path";
import cors from "cors";
import type { Express } from "express";
import express from "express";
import helmet from "helmet";
import { createContentRouter } from "./content/contentRoutes.js";
import type { ContentService } from "./content/contentService.js";
import { errorHandler, notFoundHandler } from "./http/errorHandler.js";
import { createProgressRouter } from "./progress/progressRoutes.js";
import type { ProgressService } from "./progress/progressService.js";
import { createVoiceRouter } from "./voice/voiceRoutes.js";
import type { VoiceService } from "./voice/voiceService.js";

export interface AppDependencies {
  contentService: ContentService;
  progressService: ProgressService;
  voiceService: VoiceService;
  corsOrigins: string[];
  /** Built client to serve from the same origin. Skipped when the folder doesn't exist. */
  clientDistPath?: string;
}

export function createApp({
  contentService,
  progressService,
  voiceService,
  corsOrigins,
  clientDistPath,
}: AppDependencies): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "style-src": ["'self'", "https://fonts.googleapis.com"],
          "font-src": ["'self'", "https://fonts.gstatic.com"],
          "media-src": ["'self'", "blob:"],
          // Self-hosted installs are often reached over plain HTTP on a LAN address, where upgrading breaks every asset.
          "upgrade-insecure-requests": null,
        },
      },
    }),
  );
  if (corsOrigins.length > 0) {
    app.use("/api", cors({ origin: corsOrigins }));
  }
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
  });
  app.use("/api/content", createContentRouter(contentService));
  app.use("/api/learners/:learnerId", createProgressRouter(progressService));
  app.use("/api/voice", createVoiceRouter(voiceService));
  app.use("/api", notFoundHandler);

  if (clientDistPath && existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath, { index: false, maxAge: "1h" }));
    app.get("/{*path}", (_request, response) => {
      response.sendFile(path.join(clientDistPath, "index.html"));
    });
  }

  app.use(errorHandler);

  return app;
}
