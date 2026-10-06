import { afterEach, describe, expect, it, vi } from "vitest";
import { UpstreamError } from "../src/errors.js";
import { PiperClient } from "../src/voice/piperClient.js";

function stubFetch(body: unknown, init: ResponseInit = {}) {
  const fetchMock = vi.fn<typeof fetch>(() =>
    Promise.resolve(body instanceof Uint8Array ? new Response(body, init) : Response.json(body, init)),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("PiperClient", () => {
  it("lists English and Spanish voices and drops the rest", async () => {
    stubFetch({
      "es_MX-claude-high": { language: { code: "es_MX" } },
      "en_US-lessac-high": { language: { code: "en_US" } },
      "de_DE-thorsten-high": { language: { code: "de_DE" } },
    });

    expect(await new PiperClient("http://piper:5050/").listVoices()).toEqual([
      { id: "en_US-lessac-high", lang: "en" },
      { id: "es_MX-claude-high", lang: "es" },
    ]);
  });

  it("turns the speaking rate into a phoneme length", async () => {
    const fetchMock = stubFetch(new Uint8Array([1, 2, 3]));

    const audio = await new PiperClient("http://piper:5050").synthesize({
      text: "Hola",
      voice: "es_MX-claude-high",
      rate: 1.25,
    });

    expect(fetchMock.mock.calls[0]?.[0]).toBe("http://piper:5050/synthesize");
    expect(JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string)).toEqual({
      text: "Hola",
      voice: "es_MX-claude-high",
      length_scale: 0.8,
    });
    expect([...audio]).toEqual([1, 2, 3]);
  });

  it("reports a failing server as an upstream error", async () => {
    stubFetch({ error: "boom" }, { status: 500 });

    await expect(new PiperClient("http://piper:5050").listVoices()).rejects.toBeInstanceOf(UpstreamError);
  });

  it("reports an unreachable server as an upstream error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new TypeError("fetch failed"))),
    );

    await expect(
      new PiperClient("http://piper:5050").synthesize({ text: "Hola", voice: "x", rate: 1 }),
    ).rejects.toBeInstanceOf(UpstreamError);
  });
});
