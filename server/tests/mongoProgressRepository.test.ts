import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { connectToMongo, disconnectFromMongo } from "../src/db/mongo.js";
import { MongoProgressRepository } from "../src/progress/mongoProgressRepository.js";
import { createEmptyProgress } from "../src/progress/progressDefaults.js";
import { ProgressModel } from "../src/progress/progressModel.js";

const mongoUri = process.env.TEST_MONGODB_URI;

/** Runs against a real MongoDB only when TEST_MONGODB_URI is set (CI provides one). */
describe.skipIf(!mongoUri)("MongoProgressRepository", () => {
  const repository = new MongoProgressRepository();
  const learnerId = "5d6a1b0c-1f6e-4a4c-8a1e-0b9c3e2f7a10";

  beforeAll(async () => {
    await connectToMongo(mongoUri ?? "");
    await ProgressModel.deleteMany({});
  });

  afterAll(async () => {
    await ProgressModel.deleteMany({});
    await disconnectFromMongo();
  });

  it("returns null for a learner with nothing saved", async () => {
    expect(await repository.findByLearnerId(learnerId)).toBeNull();
  });

  it("saves and reads progress without leaking Mongo fields", async () => {
    const progress = createEmptyProgress(learnerId);
    progress.xp = 42;
    progress.boxes = { "l4:0:en": 3 };
    progress.best = { "2": 0.9 };

    await repository.save(progress);
    const saved = await repository.findByLearnerId(learnerId);

    expect(saved).toEqual(progress);
  });
});
