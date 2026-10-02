import { useState } from "react";
import { randomItem } from "../lib/random";
import { countWrongWords, initialsOf } from "../lib/text";
import { Button } from "./ui/Button";
import { Eyebrow } from "./ui/Eyebrow";
import { Verdict } from "./ui/Verdict";

/**
 * Recall drill: shows the first letter of each word and the learner says the whole script line.
 * The parent remounts it (via key) whenever the saved scripts change.
 */
export function ScriptDrill({ scripts }: { scripts: string }) {
  const lines = scripts
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const [currentLine, setCurrentLine] = useState(() => randomItem(lines) ?? "");
  const [typed, setTyped] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);

  if (!currentLine) {
    return (
      <p className="text-sm text-ink-soft">
        No scripts saved yet. Once you paste them, you'll get a recall drill here: first letters only, you say
        the full line.
      </p>
    );
  }

  const wrongWords = typed ? countWrongWords(currentLine, typed) : null;

  function another() {
    setCurrentLine(randomItem(lines) ?? "");
    setTyped("");
    setIsRevealed(false);
  }

  return (
    <div className="grid gap-3">
      <Eyebrow>Say the full script from these first letters</Eyebrow>
      <div className="font-mono text-[1.05rem] tracking-wide wrap-anywhere">{initialsOf(currentLine)}</div>
      <div className="grid gap-1.5">
        <label htmlFor="script-typed" className="text-sm text-ink-soft">
          Optional: type it to check word for word
        </label>
        <input
          id="script-typed"
          autoComplete="off"
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          className="w-full rounded-lg border border-line bg-canvas px-3 py-2.5 text-ink"
        />
      </div>
      <div className="flex flex-wrap gap-2.5">
        <Button variant="primary" onClick={() => setIsRevealed(true)}>
          Reveal
        </Button>
        <Button onClick={another}>Another</Button>
      </div>
      {isRevealed && (
        <>
          {wrongWords !== null &&
            (wrongWords === 0 ? (
              <Verdict tone="got">Word for word.</Verdict>
            ) : (
              <Verdict tone="close">
                {wrongWords} word{wrongWords > 1 ? "s" : ""} off.
              </Verdict>
            ))}
          <p className="text-lg font-bold">{currentLine}</p>
        </>
      )}
    </div>
  );
}
