import { Router } from "express";
import { z } from "zod";
import { validate } from "../http/validate.js";
import type { ContentService } from "./contentService.js";

const itemParamsSchema = z.object({ itemId: z.string().min(1).max(40) });
const answerFixSchema = z.object({ answer: z.string().trim().min(1).max(2000) });

export function createContentRouter(service: ContentService): Router {
  const router = Router();

  router.get("/", async (_request, response) => {
    response.set("Cache-Control", "no-cache").json(await service.getContent());
  });

  router.put("/items/:itemId/answer", async (request, response) => {
    const { itemId } = validate(itemParamsSchema, request.params);
    const { answer } = validate(answerFixSchema, request.body);
    response.json(await service.fixAnswer(itemId, answer));
  });

  router.delete("/items/:itemId/answer", async (request, response) => {
    const { itemId } = validate(itemParamsSchema, request.params);
    response.json(await service.restoreAnswer(itemId));
  });

  return router;
}
