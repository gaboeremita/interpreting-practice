import type { SessionOutcome } from "@interpreting-practice/shared";
import { useState } from "react";
import { Banner } from "../components/ui/Banner";
import { Button } from "../components/ui/Button";
import { LEVELS } from "../domain/levels";
import type { Sprint, SprintResult } from "../domain/sprint";
import { createLevelSprint, createMissesSprint } from "../domain/sprint";
import { useDrillContent } from "../hooks/useDrillContent";
import { useProgress } from "../hooks/useProgress";
import { microphoneService } from "../services";
import { DrillView } from "./DrillView";
import { LadderView } from "./LadderView";
import { ResultsView } from "./ResultsView";

type Screen =
  | { name: "ladder" }
  | { name: "drill"; sprint: Sprint }
  | { name: "saving"; sprint: Sprint; results: SprintResult[]; failed: boolean }
  | { name: "results"; sprint: Sprint; results: SprintResult[]; outcome: SessionOutcome };

/** The Ladder tab: picks a sprint, runs it, saves it, and shows the result. */
export function TrainingScreen({ dueCount }: { dueCount: number }) {
  const { bank } = useDrillContent();
  const { progress, submitSession } = useProgress();
  const [screen, setScreen] = useState<Screen>({ name: "ladder" });

  async function prepareMicrophone() {
    if (progress.settings.micOn) {
      await microphoneService.ensureAccess();
    }
  }

  async function startLevel(levelIndex: number) {
    await prepareMicrophone();
    setScreen({ name: "drill", sprint: createLevelSprint(levelIndex, bank, progress.boxes) });
  }

  async function startMisses() {
    await prepareMicrophone();
    setScreen({ name: "drill", sprint: createMissesSprint(bank, progress.boxes) });
  }

  async function saveSprint(sprint: Sprint, results: SprintResult[]) {
    if (results.length === 0) {
      setScreen({ name: "ladder" });
      return;
    }

    setScreen({ name: "saving", sprint, results, failed: false });
    const outcome = await submitSession({
      levelIndex: sprint.levelIndex,
      plannedCount: sprint.items.length,
      scoreUnplayed: sprint.level.isBoss,
      results: results.map(({ item, grade }) => ({ itemId: item.id, grade })),
    });
    setScreen(
      outcome
        ? { name: "results", sprint, results, outcome }
        : { name: "saving", sprint, results, failed: true },
    );
  }

  function runAgain(sprint: Sprint) {
    void (sprint.levelIndex === null ? startMisses() : startLevel(sprint.levelIndex));
  }

  switch (screen.name) {
    case "ladder":
      return (
        <LadderView
          dueCount={dueCount}
          onStartLevel={(levelIndex) => void startLevel(levelIndex)}
          onStartMisses={() => void startMisses()}
        />
      );
    case "drill":
      return (
        <DrillView sprint={screen.sprint} onEnd={(results) => void saveSprint(screen.sprint, results)} />
      );
    case "saving":
      return screen.failed ? (
        <div className="grid gap-3">
          <Banner>Your sprint couldn't be saved.</Banner>
          <div className="flex flex-wrap gap-2.5">
            <Button variant="primary" onClick={() => void saveSprint(screen.sprint, screen.results)}>
              Try again
            </Button>
            <Button onClick={() => setScreen({ name: "ladder" })}>Discard it</Button>
          </div>
        </div>
      ) : (
        <p className="text-ink-soft">Saving your sprint…</p>
      );
    case "results": {
      const { sprint, results, outcome } = screen;
      const nextIndex = sprint.levelIndex === null ? null : sprint.levelIndex + 1;
      return (
        <ResultsView
          sprint={sprint}
          results={results}
          outcome={outcome}
          onRunAgain={() => runAgain(sprint)}
          onNextLevel={
            nextIndex !== null && nextIndex < LEVELS.length ? () => void startLevel(nextIndex) : null
          }
          onBackToLadder={() => setScreen({ name: "ladder" })}
        />
      );
    }
  }
}
