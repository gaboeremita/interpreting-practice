import { MicrophoneService } from "./microphoneService";
import { SpeechService } from "./speechService";

/** One instance of each per page: both wrap browser-wide resources (the speech queue, the mic stream). */
export const speechService = new SpeechService();
export const microphoneService = new MicrophoneService();
