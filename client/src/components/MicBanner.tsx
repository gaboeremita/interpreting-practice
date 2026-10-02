import { useProgress } from "../hooks/useProgress";
import { microphoneService } from "../services";
import { Banner } from "./ui/Banner";

export function MicBanner() {
  const { progress } = useProgress();

  if (!progress.settings.micOn) {
    return null;
  }
  if (microphoneService.isInFrame) {
    return (
      <Banner>
        The microphone is blocked when the app is embedded in another page. Open it in its own tab to talk to
        it; here you can only grade yourself.
      </Banner>
    );
  }
  if (!microphoneService.isSupported) {
    return <Banner>This browser has no speech recognition. Use Chrome or Safari for the microphone.</Banner>;
  }
  if (microphoneService.status === "blocked") {
    return (
      <Banner>
        Microphone access was refused. Allow it in the address bar's site settings, then reload.
      </Banner>
    );
  }
  if (microphoneService.status === "ready") {
    return <Banner tone="ok">Microphone on. Talk when the ring starts.</Banner>;
  }

  return null;
}
