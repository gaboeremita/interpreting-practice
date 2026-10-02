import { useSyncExternalStore } from "react";
import { speechService } from "../services";

/** Voices load asynchronously in most browsers; this re-renders once they arrive. */
export function useVoices(): readonly SpeechSynthesisVoice[] {
  return useSyncExternalStore(speechService.subscribe, speechService.getVoices);
}
