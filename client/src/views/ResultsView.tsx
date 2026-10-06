import type { SessionOutcome } from "@interpreting-practice/shared";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Eyebrow } from "../components/ui/Eyebrow";
import { PASS_MARK } from "../domain/levels";
import type { Sprint, SprintResult } from "../domain/sprint";
import { randomItem } from "../lib/random";

const PEP_TALK = {
  pass: [
    "Clean call, Master. Next rung is open.",
    "That's a pass. Nothing lost on the way through.",
    "Passed. One more sprint while you're warm?",
  ],
  fail: [
    "Not a pass yet. The misses below are the only things worth looking at.",
    "Close. Run it again, the misses come back first.",
    "Fine for a first lap. Same rung, one more go.",
  ],
};

interface ResultsViewProps {
  sprint: Sprint;
  results: SprintResult[];
  outcome: SessionOutcome;
  onRunAgain: () => void;
  onNextLevel: (() => void) | null;
  onBackToLadder: () => void;
}

export function ResultsView({
  sprint,
  results,
  outcome,
  onRunAgain,
  onNextLevel,
  onBackToLadder,
}: ResultsViewProps) {
  const passed = outcome.score >= PASS_MARK;
  const isRung = sprint.levelIndex !== null;
  const [pepTalk] = useState(() =>
    isRung
      ? randomItem(passed ? PEP_TALK.pass : PEP_TALK.fail)
      : "Misses reviewed. Anything you got right moved up a box.",
  );
  const misses = results.filter((result) => result.grade !== "got");

  return (
    <section className="grid gap-4">
      <Eyebrow>{sprint.level.name} · sprint result</Eyebrow>
      <div className="font-display text-[clamp(3.5rem,12vw,6rem)] leading-none font-black font-stretch-condensed">
        {Math.round(outcome.score * 100)}%
      </div>
      <p>
        {pepTalk}
        {isRung &&
          outcome.score > outcome.previousBest &&
          ` New best on this rung (was ${Math.round(outcome.previousBest * 100)}%).`}{" "}
        +{outcome.xpEarned} XP.
      </p>
      <div className="flex flex-wrap gap-2.5">
        <Button variant="primary" size="lg" onClick={onRunAgain}>
          Run it again
        </Button>
        {passed && onNextLevel && (
          <Button size="lg" onClick={onNextLevel}>
            Next rung
          </Button>
        )}
        <Button size="lg" onClick={onBackToLadder}>
          Back to ladder
        </Button>
      </div>
      {misses.length > 0 && (
        <>
          <Eyebrow>Look at these once, then walk away</Eyebrow>
          <div className="grid gap-1.5">
            {misses.map(({ item }) => (
              <div
                key={item.id}
                className="grid gap-0.5 rounded-lg border border-line bg-surface px-3 py-2.5"
              >
                <span>{item.prompt}</span>
                <span className="font-bold text-good">{item.display}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
