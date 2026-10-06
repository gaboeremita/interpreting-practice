import type { Lang, SpanishLocale, VoiceSource } from "@interpreting-practice/shared";
import { useEffect, useState } from "react";
import { ListeningBox } from "../components/ListeningBox";
import { Button } from "../components/ui/Button";
import { PageIntro } from "../components/ui/PageIntro";
import { Panel } from "../components/ui/Panel";
import { Verdict } from "../components/ui/Verdict";
import { useProgress } from "../hooks/useProgress";
import { usePiperStatus, useVoices } from "../hooks/useVoices";
import { microphoneService, speechService } from "../services";

interface MicTest {
  isListening: boolean;
  text: string;
}

const fieldClasses = "border-line bg-canvas text-ink max-w-full rounded-lg border p-2";

export function SettingsView() {
  const { progress, updateSettings, resetProgress } = useProgress();
  const settings = progress.settings;
  const browserVoices = useVoices();
  const piper = usePiperStatus();
  const usesPiper = settings.voiceSource === "piper";
  const voiceOptions = (lang: Lang): VoiceOption[] =>
    usesPiper
      ? piper.voices
          .filter((voice) => voice.lang === lang)
          .map((voice) => ({ value: voice.id, label: voice.id }))
      : browserVoices
          .filter((voice) => voice.lang.toLowerCase().startsWith(lang))
          .map((voice) => ({ value: voice.name, label: voice.name }));
  const [micTest, setMicTest] = useState<MicTest>({
    isListening: false,
    text: microphoneService.isInFrame
      ? "Blocked while the app is embedded in another page. Open it in its own tab."
      : "Press the button and say a sentence in Spanish.",
  });
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  useEffect(() => () => microphoneService.cancel(), []);
  // Picks up a Piper server started (or a voice downloaded) since the page loaded.
  useEffect(() => void speechService.refreshPiper(), []);

  function changeVoiceSource(voiceSource: VoiceSource) {
    // Voice names don't carry over between sources, so both languages go back to automatic.
    updateSettings({ voiceSource, enVoice: "", esVoice: "" });
  }

  async function testMicrophone() {
    const status = await microphoneService.ensureAccess();
    if (status !== "ready") {
      setMicTest({
        isListening: false,
        text:
          status === "unsupported"
            ? "No speech recognition in this browser. Use Chrome or Safari."
            : "Microphone access was refused or blocked here.",
      });
      return;
    }

    setMicTest({ isListening: true, text: "" });
    microphoneService.start("es", settings.esLocale, {
      continuous: true,
      onUpdate: (finalText, interimText) =>
        setMicTest({ isListening: true, text: `${finalText} ${interimText}` }),
      onDone: (heard) =>
        setMicTest({
          isListening: false,
          text: heard ? `Heard: ${heard}` : "Heard nothing. Check the input device in your system settings.",
        }),
    });
  }

  function testVoices() {
    void speechService
      .say("Do you have any chest pain?", "en", settings)
      .then(() => speechService.say("¿Tiene dolor en el pecho?", "es", settings));
  }

  async function confirmReset() {
    if (await resetProgress()) {
      setIsConfirmingReset(false);
    }
  }

  return (
    <div className="grid gap-4">
      <PageIntro title="Settings" />
      <Panel>
        {!speechService.isSupported && (
          <Verdict tone="close">
            This browser has no speech voices, so prompts show as text. Chrome, Edge and Safari have them.
          </Verdict>
        )}

        <div className="grid gap-1.5">
          <label htmlFor="voice-source" className="font-bold">
            Voices
          </label>
          <select
            id="voice-source"
            value={settings.voiceSource}
            onChange={(event) => changeVoiceSource(event.target.value as VoiceSource)}
            className={fieldClasses}
          >
            <option value="browser">Browser voices</option>
            <option value="piper" disabled={!piper.available && !usesPiper}>
              Piper (natural voices, runs on your computer){piper.available ? "" : " — not running"}
            </option>
          </select>
          {usesPiper && !piper.available && (
            <p className="text-sm text-ink-soft">
              Piper isn't answering, so the browser voices are speaking for now. Start the Piper server and
              reopen this page.
            </p>
          )}
        </div>

        <VoiceSelect
          id="voice-es"
          label="Spanish voice"
          options={voiceOptions("es")}
          value={settings.esVoice}
          onChange={(esVoice) => updateSettings({ esVoice })}
        />
        <VoiceSelect
          id="voice-en"
          label="English voice"
          options={voiceOptions("en")}
          value={settings.enVoice}
          onChange={(enVoice) => updateSettings({ enVoice })}
        />

        <div className="grid gap-1.5">
          <label htmlFor="rate" className="font-bold">
            Speaking speed: <span className="font-mono">{settings.rate.toFixed(2)}</span>
          </label>
          <input
            id="rate"
            type="range"
            min="0.7"
            max="1.3"
            step="0.05"
            value={settings.rate}
            onChange={(event) => updateSettings({ rate: Number(event.target.value) })}
            className="accent-accent"
          />
        </div>

        <Toggle
          checked={settings.autoSpeak}
          onChange={(autoSpeak) => updateSettings({ autoSpeak })}
          label="Read each prompt aloud automatically"
        />
        <Toggle
          checked={settings.micOn}
          onChange={(micOn) => updateSettings({ micOn })}
          label="Use the microphone to hear and check my answers"
        />

        <div className="grid gap-1.5">
          <label htmlFor="es-locale" className="font-bold">
            Spanish the mic listens for
          </label>
          <select
            id="es-locale"
            value={settings.esLocale}
            onChange={(event) => updateSettings({ esLocale: event.target.value as SpanishLocale })}
            className={fieldClasses}
          >
            <option value="es-MX">Spanish (Mexico)</option>
            <option value="es-US">Spanish (United States)</option>
          </select>
        </div>

        <div>
          <Button onClick={() => void testMicrophone()}>Test microphone (Spanish)</Button>
        </div>
        <ListeningBox
          isListening={micTest.isListening}
          finalText={micTest.text}
          interimText=""
          placeholder="Listening…"
        />

        <Toggle
          checked={settings.typeMode}
          onChange={(typeMode) => updateSettings({ typeMode })}
          label="Type mode: also type each answer so the app checks the exact wording"
        />

        <div className="flex flex-wrap gap-2.5">
          <Button onClick={testVoices}>Test voices</Button>
          <Button onClick={() => setIsConfirmingReset(true)}>Reset all progress</Button>
        </div>
        {isConfirmingReset && (
          <div className="grid justify-items-start gap-2">
            <p>This wipes XP, best scores and review boxes. Your saved scripts and settings stay.</p>
            <Button variant="miss" onClick={() => void confirmReset()}>
              Yes, reset
            </Button>
          </div>
        )}

        <p className="text-sm text-ink-soft">
          Progress is saved on the server for this browser. In Chrome, speech recognition sends your audio to
          Google's servers to transcribe it; Safari uses Apple's. Recordings of your answers stay in the page
          and are gone when you close it.
        </p>
      </Panel>
    </div>
  );
}

interface VoiceOption {
  value: string;
  label: string;
}

interface VoiceSelectProps {
  id: string;
  label: string;
  options: readonly VoiceOption[];
  value: string;
  onChange: (voiceName: string) => void;
}

function VoiceSelect({ id, label, options, value, onChange }: VoiceSelectProps) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="font-bold">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClasses}
      >
        <option value="">Automatic</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-4 accent-accent"
      />
      {label}
    </label>
  );
}
