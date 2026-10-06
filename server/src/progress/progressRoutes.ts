import type { SessionOutcome } from "@interpreting-practice/shared";
import { Router } from "express";
import { validate } from "../http/validate.js";
import {
  learnerParamsSchema,
  scriptsSchema,
  sessionSubmissionSchema,
  settingsChangesSchema,
  unlockAllSchema,
} from "./progressSchemas.js";
import type { ProgressService } from "./progressService.js";

export function createProgressRouter(service: ProgressService): Router {
  const router = Router({ mergeParams: true });
  const learnerIdOf = (params: unknown): string => validate(learnerParamsSchema, params).learnerId;

  router.get("/progress", async (request, response) => {
    response.json(await service.get(learnerIdOf(request.params)));
  });

  router.delete("/progress", async (request, response) => {
    response.json(await service.reset(learnerIdOf(request.params)));
  });

  router.post("/sessions", async (request, response) => {
    const learnerId = learnerIdOf(request.params);
    const submission = validate(sessionSubmissionSchema, request.body);
    const outcome: SessionOutcome = await service.recordSession(learnerId, submission);
    response.status(201).json(outcome);
  });

  router.patch("/settings", async (request, response) => {
    const changes = validate(settingsChangesSchema, request.body);
    response.json(await service.updateSettings(learnerIdOf(request.params), changes));
  });

  router.put("/scripts", async (request, response) => {
    const { scripts } = validate(scriptsSchema, request.body);
    response.json(await service.saveScripts(learnerIdOf(request.params), scripts));
  });

  router.put("/unlock-all", async (request, response) => {
    const { unlockAll } = validate(unlockAllSchema, request.body);
    response.json(await service.setUnlockAll(learnerIdOf(request.params), unlockAll));
  });

  return router;
}
