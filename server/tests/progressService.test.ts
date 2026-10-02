import type { SessionSubmission } from "@isa-drill-room/shared";
import { beforeEach, describe, expect, it } from "vitest";
import { ContentCatalog } from "../src/content/contentCatalog.js";
import { ValidationError } from "../src/errors.js";
import { ProgressService } from "../src/progress/progressService.js";
import { InMemoryProgressRepository } from "./support/inMemoryProgressRepository.js";

const learnerId = "3f0b8f5e-6a3b-4b8e-9c55-2d1a7a0f4c11";

function submission(overrides: Partial<SessionSubmission> = {}): SessionSubmission {
  return {
    levelIndex: 0,
    plannedCount: 2,
    scoreUnplayed: false,
    results: [
      { itemId: "l4:0:en", grade: "got" },
      { itemId: "l4:1:en", grade: "miss" },
    ],
    playedOn: "2026-10-02",
    ...overrides,
  };
}

describe("ProgressService", () => {
  let service: ProgressService;

  beforeEach(() => {
    service = new ProgressService(new InMemoryProgressRepository(), ContentCatalog.fromBundledData());
  });

  it("returns empty progress for a new learner", async () => {
    const progress = await service.get(learnerId);
    expect(progress.xp).toBe(0);
    expect(progress.settings.esLocale).toBe("es-MX");
  });

  it("records a sprint: boxes, xp, best score and streak", async () => {
    const outcome = await service.recordSession(learnerId, submission());

    expect(outcome.score).toBe(0.5);
    expect(outcome.previousBest).toBe(0);
    expect(outcome.xpEarned).toBe(10);
    expect(outcome.progress.boxes).toEqual({ "l4:0:en": 2, "l4:1:en": 1 });
    expect(outcome.progress.best).toEqual({ "0": 0.5 });
    expect(outcome.progress.streak).toEqual({ last: "2026-10-02", count: 1 });
  });

  it("keeps the best score when a later sprint is worse", async () => {
    await service.recordSession(learnerId, submission());
    const outcome = await service.recordSession(
      learnerId,
      submission({ results: [{ itemId: "l4:0:en", grade: "miss" }], plannedCount: 1 }),
    );

    expect(outcome.previousBest).toBe(0.5);
    expect(outcome.progress.best["0"]).toBe(0.5);
  });

  it("does not record a best score for a misses sprint", async () => {
    const outcome = await service.recordSession(learnerId, submission({ levelIndex: null }));
    expect(outcome.progress.best).toEqual({});
  });

  it("rejects unknown item ids", async () => {
    await expect(
      service.recordSession(learnerId, submission({ results: [{ itemId: "nope:1", grade: "got" }] })),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("resets scores but keeps scripts and settings", async () => {
    await service.recordSession(learnerId, submission());
    await service.saveScripts(learnerId, "Hello, my name is…");
    await service.updateSettings(learnerId, { rate: 1.1 });

    const progress = await service.reset(learnerId);

    expect(progress.xp).toBe(0);
    expect(progress.boxes).toEqual({});
    expect(progress.scripts).toBe("Hello, my name is…");
    expect(progress.settings.rate).toBe(1.1);
  });
});
