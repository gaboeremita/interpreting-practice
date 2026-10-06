import type { DrillItem, Grade, Settings } from "@interpreting-practice/shared";
import { useRef, useState } from "react";
import { isTypingInField, useKeydown } from "../hooks/useKeydown";
import { checkAnswer, checkAnyAnswer, displayOptions, unitWasRendered } from "../lib/text";
import { microphoneService, speechService } from "../services";
import { AnswerFixer } from "./AnswerFixer";
import { Button } from "./ui/Button";
import { Eyebrow } from "./ui/Eyebrow";
import { Kbd } from "./ui/Kbd";
import { Verdict } from "./ui/Verdict";

export interface AnswerAttempt {
  heard: string;
  alternatives: string[];
  typed: string;
  timedOut: boolean;
  peeked: boolean;
}

interface RevealPanelProps {
  item: DrillItem;
  attempt: AnswerAttempt;
  micUsable: boolean;
  settings: Settings;
  onGrade: (grade: Grade) => void;
}

const VERDICT_TEXT: Record<Grade, string> = {
  got: "Exact match with the glossary wording.",
  close: "Close: a small slip in spelling or wording. Aim for the exact term.",
  miss: "Doesn't match the glossary wording.",
};

/** Unit-scored items need about 90% of units for a hit and 60% for a close call. */
const UNIT_GOT_SHARE = 0.9;
const UNIT_CLOSE_SHARE = 0.6;

export function RevealPanel({ item: servedItem, attempt, micUsable, settings, onGrade }: RevealPanelProps) {
  // The sprint holds the item as it was served; a fix made here regrades against the corrected answer.
  const [item, setItem] = useState(servedItem);
  const units = item.units;
  const answerText = attempt.typed || attempt.heard;
  const target = item.from === "en" ? "es" : "en";
  const autoGrade = suggestGrade(item, attempt);
  const [tickedUnits, setTickedUnits] = useState(() =>
    (units ?? []).map((unit) => Boolean(answerText) && unitWasRendered(unit, answerText)),
  );
  const graded = useRef(false);

  function finalize(grade: Grade) {
    if (graded.current) {
      return;
    }
    graded.current = true;
    onGrade(attempt.peeked && grade === "got" ? "close" : grade);
  }

  function scoreUnits() {
    const share = tickedUnits.filter(Boolean).length / Math.max(tickedUnits.length, 1);
    finalize(share >= UNIT_GOT_SHARE ? "got" : share >= UNIT_CLOSE_SHARE ? "close" : "miss");
  }

  function toggleUnit(index: number) {
    setTickedUnits((current) => current.map((ticked, k) => (k === index ? !ticked : ticked)));
  }

  function hearAnswer() {
    void speechService.say(units ? item.display : (item.accepted[0] ?? item.display), target, settings);
  }

  useKeydown((event) => {
    if (isTypingInField()) {
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (units) {
        scoreUnits();
      } else if (autoGrade) {
        finalize(autoGrade);
      }
      return;
    }
    const grade = ({ "1": "got", "2": "close", "3": "miss" } as const)[event.key as "1" | "2" | "3"];
    if (grade && !units) {
      finalize(grade);
    }
  });

  return (
    <div className="grid gap-3 border-t border-dashed border-line pt-4">
      {attempt.timedOut && !answerText && (
        <Verdict tone="miss">Time's up. On the real call the next turn is already coming.</Verdict>
      )}
      {attempt.timedOut && answerText && (
        <Verdict tone="close">
          The clock ran out while you were talking. Aim to finish inside the ring.
        </Verdict>
      )}
      {attempt.heard && (
        <div className="grid gap-1">
          <Eyebrow>The mic heard</Eyebrow>
          <div>{attempt.heard}</div>
        </div>
      )}
      {micUsable && !attempt.heard && !attempt.typed && (
        <p className="text-sm text-ink-soft">
          The mic didn't catch anything. Grade it yourself, or check the mic in Settings.
        </p>
      )}
      {autoGrade && <Verdict tone={autoGrade}>{VERDICT_TEXT[autoGrade]}</Verdict>}

      <div className="grid gap-1.5">
        <Eyebrow>{units ? "Model rendition" : "Exact wording they accept"}</Eyebrow>
        {units ? (
          <div className="text-lg font-bold">{item.display}</div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {displayOptions(item.display).map((option) => (
              <span key={option} className="rounded-md bg-good-bg px-2.5 py-1 font-bold text-good">
                {option}
              </span>
            ))}
          </div>
        )}
      </div>

      <AnswerFixer item={item} onFixed={setItem} />

      {item.definition && <p className="max-w-[70ch] text-sm text-ink-soft">{item.definition}</p>}

      {units && (
        <div className="grid gap-1.5">
          <Eyebrow>Tick each unit you rendered correctly</Eyebrow>
          {answerText && (
            <p className="text-sm text-ink-soft">
              Pre-ticked from what you said. Fix anything the mic misheard.
            </p>
          )}
          {units.map((unit, index) => (
            <label
              key={unit}
              className="flex items-center gap-2.5 rounded-lg border border-line bg-canvas px-2.5 py-2"
            >
              <input
                type="checkbox"
                className="size-5 accent-accent"
                checked={tickedUnits[index] ?? false}
                onChange={() => toggleUnit(index)}
              />
              {unit}
            </label>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2.5">
        {speechService.isSupported && <Button onClick={hearAnswer}>Hear answer</Button>}
        {attempt.heard && microphoneService.recordingUrl && (
          <Button onClick={() => microphoneService.playRecording()}>Play my answer</Button>
        )}
        {units ? (
          <Button variant="primary" onClick={scoreUnits}>
            Score it<Kbd>Enter</Kbd>
          </Button>
        ) : (
          <>
            <Button variant="got" highlighted={autoGrade === "got"} onClick={() => finalize("got")}>
              Got it<Kbd>1</Kbd>
            </Button>
            <Button variant="close" highlighted={autoGrade === "close"} onClick={() => finalize("close")}>
              Close<Kbd>2</Kbd>
            </Button>
            <Button variant="miss" highlighted={autoGrade === "miss"} onClick={() => finalize("miss")}>
              Missed<Kbd>3</Kbd>
            </Button>
          </>
        )}
      </div>

      {autoGrade && (
        <p className="text-sm text-ink-soft">
          Outlined button is the app's verdict. Press Enter to accept it, or pick another if the mic misheard
          you.
        </p>
      )}
      {attempt.peeked && (
        <p className="text-sm text-ink-soft">You peeked, so this item counts half at most.</p>
      )}
    </div>
  );
}

/** Typed answers win over the mic; unit-scored items are graded by ticking units instead. */
function suggestGrade(item: DrillItem, attempt: AnswerAttempt): Grade | null {
  if (item.units) {
    return null;
  }
  if (attempt.typed) {
    return checkAnswer(attempt.typed, item.accepted);
  }
  if (attempt.heard) {
    return checkAnyAnswer([attempt.heard, ...attempt.alternatives], item.accepted);
  }

  return null;
}
