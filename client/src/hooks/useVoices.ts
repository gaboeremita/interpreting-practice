import type { PiperStatus } from "@interpreting-practice/shared";
import { useSyncExternalStore } from "react";
import { speechService } from "../services";

/** Voices load asynchronously in most browsers; this re-renders once they arrive. */
export function useVoices(): readonly SpeechSynthesisVoice[] {
  return useSyncExternalStore(speechService.subscribe, speechService.getVoices);
}

/** Piper's voices, re-rendering whenever the status is refreshed. */
export function usePiperStatus(): PiperStatus {
  return useSyncExternalStore(speechService.subscribe, speechService.getPiperStatus);
}
