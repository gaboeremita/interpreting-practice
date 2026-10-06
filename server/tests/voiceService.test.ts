import { beforeEach, describe, expect, it } from "vitest";
import { NotFoundError, ValidationError } from "../src/errors.js";
import { AudioCache } from "../src/voice/audioCache.js";
import { VoiceService } from "../src/voice/voiceService.js";
import { FakeSynthesizer } from "./support/fakeSynthesizer.js";

const voices = [
  { id: "en_US-lessac-high", lang: "en" },
  { id: "es_MX-claude-high", lang: "es" },
] as const;

describe("VoiceService", () => {
  let piper: FakeSynthesizer;
  let clock: number;
  let service: VoiceService;

  beforeEach(() => {
    piper = new FakeSynthesizer([...voices]);
    clock = 0;
    service = new VoiceService(piper, new AudioCache(1024), () => clock);
  });

  it("reports Piper's voices", async () => {
    expect(await service.status()).toEqual({ available: true, voices });
  });

  it("reports Piper as unavailable when it's down or not configured", async () => {
    piper.isDown = true;

    expect(await service.status()).toEqual({ available: false, voices: [] });
    expect(await new VoiceService(null).status()).toEqual({ available: false, voices: [] });
  });

  it("synthesizes once per phrase and serves repeats from the cache", async () => {
    const request = { voice: "es_MX-claude-high", text: "¿Le duele?", rate: 1 };

    const first = await service.synthesize(request);
    const second = await service.synthesize(request);

    expect(second).toBe(first);
    expect(piper.synthesized).toHaveLength(1);
  });

  it("treats a different speed as a different clip", async () => {
    await service.synthesize({ voice: "en_US-lessac-high", text: "Hello", rate: 1 });
    await service.synthesize({ voice: "en_US-lessac-high", text: "Hello", rate: 1.2 });

    expect(piper.synthesized.map((input) => input.rate)).toEqual([1, 1.2]);
  });

  it("rejects voices Piper doesn't have", async () => {
    await expect(service.synthesize({ voice: "Bella", text: "Hola", rate: 1 })).rejects.toBeInstanceOf(
      ValidationError,
    );
    expect(piper.synthesized).toHaveLength(0);
  });

  it("refuses to synthesize when Piper isn't configured", async () => {
    await expect(
      new VoiceService(null).synthesize({ voice: "en_US-lessac-high", text: "Hello", rate: 1 }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("reuses the voice list for a minute", async () => {
    await service.status();
    clock = 59_000;
    await service.status();
    expect(piper.listCalls).toBe(1);

    clock = 61_000;
    await service.status();
    expect(piper.listCalls).toBe(2);
  });
});
