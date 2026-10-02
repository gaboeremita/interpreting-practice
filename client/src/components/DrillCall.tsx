import type { DrillItem, Grade, Settings } from "@isa-drill-room/shared";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { Level } from "../domain/levels";
import { isLongItem, secondsFor } from "../domain/sprint";
import { useCountdown } from "../hooks/useCountdown";
import { isTypingInField, useKeydown } from "../hooks/useKeydown";
import { classNames } from "../lib/classNames";
import { microphoneService, speechService } from "../services";
import { CountdownRing } from "./CountdownRing";
import { ListeningBox } from "./ListeningBox";
import type { AnswerAttempt } from "./RevealPanel";
import { RevealPanel } from "./RevealPanel";
import { Button } from "./ui/Button";
import { Kbd } from "./ui/Kbd";

/** listen: the prompt is playing · answer: the clock and mic are running · revealed: grading. */
type Phase = "listen" | "answer" | "revealed";

interface Transcript {
  finalText: string;
  interimText: string;
  isListening: boolean;
}

interface DrillCallProps {
  item: DrillItem;
  level: Level;
  settings: Settings;
  micUsable: boolean;
  onGrade: (grade: Grade) => void;
  onQuit: () => void;
}

/**
 * One item of a sprint: plays the prompt, runs the clock and the mic, then hands over to the reveal panel.
 * Callbacks from speech, the mic and the clock arrive asynchronously, so the phase and answer inputs
 * are mirrored in refs to read their latest values there.
 */
export function DrillCall({ item, level, settings, micUsable, onGrade, onQuit }: DrillCallProps) {
  const seconds = secondsFor(item, level);
  const targetLang = item.from === "en" ? "es" : "en";
  const isAudioOnly = level.audioOnly && speechService.isSupported;
  const isLong = isLongItem(item);
  const speaker = item.speaker ?? (item.from === "en" ? "Provider" : "Patient");
  const willSpeak = speechService.isSupported && settings.autoSpeak;

  const [phase, setPhaseState] = useState<Phase>("listen");
  const [peeked, setPeeked] = useState(false);
  const [typed, setTyped] = useState("");
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [attempt, setAttempt] = useState<AnswerAttempt | null>(null);
  const phaseRef = useRef<Phase>("listen");
  const peekedRef = useRef(false);
  const typedRef = useRef("");
  const timedOutRef = useRef(false);
  const typedInput = useRef<HTMLInputElement>(null);
  const countdown = useCountdown(handleTimeUp);

  function setPhase(next: Phase) {
    phaseRef.current = next;
    setPhaseState(next);
  }

  function startClock() {
    if (phaseRef.current !== "listen") {
      return;
    }
    setPhase("answer");
    openMic();
    countdown.start(seconds);
  }

  function openMic() {
    if (!micUsable || phaseRef.current !== "answer") {
      return;
    }
    setTranscript({ finalText: "", interimText: "", isListening: true });
    microphoneService.start(targetLang, settings.esLocale, {
      continuous: isLong,
      onUpdate: (finalText, interimText) => setTranscript({ finalText, interimText, isListening: true }),
      onDone: (heard, alternatives) => reveal(heard, alternatives),
    });
  }

  function handleTimeUp() {
    timedOutRef.current = true;
    if (microphoneService.isActive()) {
      microphoneService.stop();
    } else {
      reveal();
    }
  }

  function reveal(heard = "", alternatives: string[] = []) {
    if (phaseRef.current === "revealed") {
      return;
    }
    setPhase("revealed");
    countdown.stop();
    speechService.stop();
    typedInput.current?.blur();
    setTranscript((current) => current && { ...current, interimText: "", isListening: false });
    setAttempt({
      heard,
      alternatives,
      typed: typedRef.current,
      timedOut: timedOutRef.current,
      peeked: peekedRef.current,
    });
  }

  /** Stopping the mic reports what it heard, which then reveals; otherwise reveal straight away. */
  function requestReveal() {
    if (microphoneService.isActive()) {
      microphoneService.stop();
    } else {
      reveal();
    }
  }

  function replay() {
    // Close the mic while the prompt replays so it doesn't transcribe the speaker.
    const wasListening = microphoneService.isActive();
    if (wasListening) {
      microphoneService.cancel();
    }
    void speechService.say(item.prompt, item.from, settings).then(() => {
      if (wasListening) {
        openMic();
      }
    });
  }

  function peek() {
    peekedRef.current = true;
    setPeeked(true);
  }

  function quit() {
    countdown.stop();
    speechService.stop();
    microphoneService.cancel();
    onQuit();
  }

  const beginItem = useEffectEvent((isCancelled: () => boolean) => {
    if (!willSpeak) {
      startClock();
      return;
    }
    void speechService.say(item.prompt, item.from, settings).then(() => {
      if (!isCancelled()) {
        startClock();
      }
    });
  });

  useEffect(() => {
    let cancelled = false;
    beginItem(() => cancelled);

    return () => {
      cancelled = true;
      speechService.stop();
      microphoneService.cancel();
    };
  }, []);

  useKeydown((event) => {
    if (phaseRef.current === "revealed" || isTypingInField()) {
      return;
    }
    if (event.key === " ") {
      event.preventDefault();
      requestReveal();
    } else if (event.key.toLowerCase() === "r" && speechService.isSupported) {
      replay();
    }
  });

  const isRevealed = phase === "revealed";
  const showPromptText = !isAudioOnly || peeked || isRevealed;

  return (
    <article className="grid gap-[18px] rounded-[14px] border border-line bg-surface p-[22px] max-[520px]:p-4">
      <div className="grid grid-cols-[1fr_auto] items-start gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-ink-soft uppercase">
            <span className="rounded bg-ink px-1.5 py-0.5 font-mono tracking-wide text-canvas">
              {item.from === "en" ? "EN → ES" : "ES → EN"}
            </span>
            {speaker} says
          </div>
          <div
            className={classNames(
              "mt-2 min-w-0 wrap-anywhere",
              !showPromptText
                ? "text-lg text-ink-soft italic"
                : isLong
                  ? "text-[clamp(1.15rem,3vw,1.5rem)] leading-relaxed"
                  : "font-display text-[clamp(1.5rem,4.4vw,2.4rem)] leading-tight font-bold font-stretch-semi-condensed",
            )}
          >
            {showPromptText ? item.prompt : "Listening… text is hidden, like on a real call."}
          </div>
        </div>
        <CountdownRing
          secondsLeft={countdown.secondsLeft}
          totalSeconds={countdown.totalSeconds}
          idleLabel={phase === "listen" ? (willSpeak ? "listen" : String(seconds)) : null}
        />
      </div>

      {settings.typeMode && (
        <div className="grid gap-1.5">
          <label htmlFor="typed-answer" className="text-sm text-ink-soft">
            Type your rendition (checked against the exact wording)
          </label>
          <input
            id="typed-answer"
            ref={typedInput}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            disabled={isRevealed}
            value={typed}
            onChange={(event) => {
              typedRef.current = event.target.value;
              setTyped(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter") {
                return;
              }
              event.preventDefault();
              // The reveal panel mounts during this keypress; without this it would also take Enter as "accept".
              event.stopPropagation();
              microphoneService.cancel();
              reveal();
            }}
            className="w-full rounded-lg border border-line bg-canvas px-3 py-2.5 text-ink"
          />
        </div>
      )}

      {micUsable && (
        <ListeningBox
          isListening={transcript?.isListening ?? false}
          finalText={transcript?.finalText ?? ""}
          interimText={transcript?.interimText ?? ""}
          placeholder={transcript?.isListening ? "Listening…" : "The mic opens when the ring starts."}
        />
      )}

      <div className="flex flex-wrap gap-2.5">
        <Button onClick={replay} disabled={!speechService.isSupported}>
          Replay<Kbd>R</Kbd>
        </Button>
        {isAudioOnly && (
          <Button onClick={peek} disabled={peeked || isRevealed}>
            Peek at text (−50%)
          </Button>
        )}
        <Button variant="primary" onClick={requestReveal} disabled={isRevealed}>
          Reveal answer<Kbd>Space</Kbd>
        </Button>
        <Button onClick={quit}>End sprint</Button>
      </div>

      {attempt && (
        <RevealPanel
          item={item}
          attempt={attempt}
          micUsable={micUsable}
          settings={settings}
          onGrade={onGrade}
        />
      )}

      <p className="text-sm text-ink-soft">
        {micUsable
          ? isLong
            ? "Talk when the ring starts. It stops listening after a two-second pause."
            : "Talk when the ring starts. It stops listening when you finish the term."
          : "Say it out loud, Master. Saying it in your head doesn't count, the test is spoken."}
      </p>
    </article>
  );
}
