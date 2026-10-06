import { Router } from "express";
import { z } from "zod";
import { validate } from "../http/validate.js";
import type { VoiceService } from "./voiceService.js";

const speechRequestSchema = z
  .object({
    voice: z.string().min(1).max(100),
    text: z.string().trim().min(1).max(1_000),
    rate: z.number().min(0.7).max(1.3),
  })
  .strict();

export function createVoiceRouter(service: VoiceService): Router {
  const router = Router();

  router.get("/piper", async (_request, response) => {
    response.json(await service.status());
  });

  router.post("/speech", async (request, response) => {
    const audio = await service.synthesize(validate(speechRequestSchema, request.body));
    response.type("audio/wav").send(audio);
  });

  return router;
}
