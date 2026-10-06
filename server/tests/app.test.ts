import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { ContentCatalog } from "../src/content/contentCatalog.js";
import { ContentService } from "../src/content/contentService.js";
import { ProgressService } from "../src/progress/progressService.js";
import { VoiceService } from "../src/voice/voiceService.js";
import { FakeSynthesizer } from "./support/fakeSynthesizer.js";
import { InMemoryAnswerFixRepository } from "./support/inMemoryAnswerFixRepository.js";
import { InMemoryProgressRepository } from "./support/inMemoryProgressRepository.js";

const learnerId = "3f0b8f5e-6a3b-4b8e-9c55-2d1a7a0f4c11";

describe("HTTP API", () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    const catalog = ContentCatalog.fromBundledData();
    app = createApp({
      contentService: new ContentService(catalog, new InMemoryAnswerFixRepository()),
      progressService: new ProgressService(new InMemoryProgressRepository(), catalog),
      voiceService: new VoiceService(new FakeSynthesizer([{ id: "es_MX-claude-high", lang: "es" }])),
      corsOrigins: [],
    });
  });

  it("reports health", async () => {
    await request(app).get("/api/health").expect(200, { status: "ok" });
  });

  it("serves content", async () => {
    const response = await request(app).get("/api/content").expect(200);
    expect(response.body.items.length).toBeGreaterThan(500);
    expect(response.body.quiz.length).toBe(8);
  });

  it("fixes an item's answer and restores the original", async () => {
    const fixed = await request(app)
      .put("/api/content/items/l4:0:en/answer")
      .send({ answer: "reflujo ácido" })
      .expect(200);
    const item = fixed.body.items.find((candidate: { id: string }) => candidate.id === "l4:0:en");
    expect(item.accepted).toEqual(["reflujo ácido"]);
    expect(item.original).toBe("Reflujo acídico, reflujo gástrico");

    const served = await request(app).get("/api/content").expect(200);
    expect(served.body.items.find((candidate: { id: string }) => candidate.id === "l4:0:es").prompt).toBe(
      "reflujo ácido",
    );

    const restored = await request(app).delete("/api/content/items/l4:0:en/answer").expect(200);
    const back = restored.body.items.find((candidate: { id: string }) => candidate.id === "l4:0:en");
    expect(back.display).toBe("Reflujo acídico, reflujo gástrico");
    expect(back.original).toBeUndefined();
  });

  it("rejects an empty fix and an unknown item", async () => {
    await request(app).put("/api/content/items/l4:0:en/answer").send({ answer: "  " }).expect(422);
    await request(app).put("/api/content/items/l4:9999:en/answer").send({ answer: "x" }).expect(404);
  });

  it("rejects a learner id that is not a UUID", async () => {
    const response = await request(app).get("/api/learners/not-a-uuid/progress").expect(422);
    expect(response.body.error).toBe("The request is invalid.");
  });

  it("records a sprint and returns the updated progress", async () => {
    const response = await request(app)
      .post(`/api/learners/${learnerId}/sessions`)
      .send({
        levelIndex: 0,
        plannedCount: 1,
        scoreUnplayed: false,
        results: [{ itemId: "l4:0:en", grade: "got" }],
        playedOn: "2026-10-02",
      })
      .expect(201);

    expect(response.body.score).toBe(1);
    expect(response.body.progress.xp).toBe(10);

    const saved = await request(app).get(`/api/learners/${learnerId}/progress`).expect(200);
    expect(saved.body.boxes["l4:0:en"]).toBe(2);
  });

  it("validates sprint submissions", async () => {
    await request(app)
      .post(`/api/learners/${learnerId}/sessions`)
      .send({ levelIndex: 0, plannedCount: 1, scoreUnplayed: false, results: [], playedOn: "yesterday" })
      .expect(422);
  });

  it("rejects unknown settings", async () => {
    await request(app).patch(`/api/learners/${learnerId}/settings`).send({ theme: "dark" }).expect(422);
  });

  it("updates settings, scripts and the unlock flag", async () => {
    await request(app).patch(`/api/learners/${learnerId}/settings`).send({ micOn: false }).expect(200);
    await request(app).put(`/api/learners/${learnerId}/scripts`).send({ scripts: "Line one" }).expect(200);
    const response = await request(app)
      .put(`/api/learners/${learnerId}/unlock-all`)
      .send({ unlockAll: true })
      .expect(200);

    expect(response.body.settings.micOn).toBe(false);
    expect(response.body.scripts).toBe("Line one");
    expect(response.body.unlockAll).toBe(true);
  });

  it("answers malformed JSON with a 400", async () => {
    await request(app)
      .put(`/api/learners/${learnerId}/scripts`)
      .set("Content-Type", "application/json")
      .send("{not json")
      .expect(400);
  });

  it("reports Piper's voices", async () => {
    const response = await request(app).get("/api/voice/piper").expect(200);
    expect(response.body).toEqual({ available: true, voices: [{ id: "es_MX-claude-high", lang: "es" }] });
  });

  it("returns synthesized speech as WAV", async () => {
    const response = await request(app)
      .post("/api/voice/speech")
      .send({ voice: "es_MX-claude-high", text: "  Hola  ", rate: 1 })
      .expect("Content-Type", "audio/wav")
      .expect(200);

    expect(response.body.toString()).toBe("es_MX-claude-high:1:Hola");
  });

  it("validates speech requests", async () => {
    await request(app)
      .post("/api/voice/speech")
      .send({ voice: "es_MX-claude-high", text: "", rate: 1 })
      .expect(422);
    await request(app).post("/api/voice/speech").send({ voice: "Bella", text: "Hello", rate: 1 }).expect(422);
  });

  it("answers unknown API routes with a 404", async () => {
    await request(app).get("/api/nope").expect(404);
  });
});
