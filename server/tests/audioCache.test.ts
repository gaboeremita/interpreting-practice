import { describe, expect, it } from "vitest";
import { AudioCache } from "../src/voice/audioCache.js";

const clip = (bytes: number) => Buffer.alloc(bytes);

describe("AudioCache", () => {
  it("evicts the least recently used clips once over its size", () => {
    const cache = new AudioCache(10);
    cache.set("a", clip(4));
    cache.set("b", clip(4));
    cache.get("a");
    cache.set("c", clip(4));

    expect(cache.get("a")).toBeDefined();
    expect(cache.get("b")).toBeUndefined();
    expect(cache.get("c")).toBeDefined();
  });

  it("skips clips bigger than the whole cache", () => {
    const cache = new AudioCache(10);
    cache.set("big", clip(11));

    expect(cache.size).toBe(0);
  });

  it("counts a replaced clip once", () => {
    const cache = new AudioCache(10);
    cache.set("a", clip(6));
    cache.set("a", clip(6));
    cache.set("b", clip(4));

    expect(cache.size).toBe(2);
  });
});
