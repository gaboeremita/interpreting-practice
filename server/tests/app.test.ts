import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { ContentCatalog } from "../src/content/contentCatalog.js";
import { ProgressService } from "../src/progress/progressService.js";
import { InMemoryProgressRepository } from "./support/inMemoryProgressRepository.js";

const learnerId = "3f0b8f5e-6a3b-4b8e-9c55-2d1a7a0f4c11";

describe("HTTP API", () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    const catalog = ContentCatalog.fromBundledData();
    app = createApp({
      catalog,
      progressService: new ProgressService(new InMemoryProgressRepository(), catalog),
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

  it("answers unknown API routes with a 404", async () => {
    await request(app).get("/api/nope").expect(404);
  });
});
