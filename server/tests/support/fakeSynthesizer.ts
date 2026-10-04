import type { VoiceOption } from "@isa-drill-room/shared";
import type { SpeechSynthesizer, SynthesisInput } from "../../src/voice/piperClient.js";

/** Records every call and answers with a clip that spells out its input. */
export class FakeSynthesizer implements SpeechSynthesizer {
  readonly synthesized: SynthesisInput[] = [];
  listCalls = 0;
  isDown = false;

  constructor(private readonly voices: VoiceOption[]) {}

  listVoices(): Promise<VoiceOption[]> {
    this.listCalls += 1;
    return this.isDown ? Promise.reject(new Error("down")) : Promise.resolve(this.voices);
  }

  synthesize(input: SynthesisInput): Promise<Buffer> {
    this.synthesized.push(input);
    return Promise.resolve(Buffer.from(`${input.voice}:${input.rate}:${input.text}`));
  }
}
