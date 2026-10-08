import type { Grade } from "@interpreting-practice/shared";
import { useState } from "react";
import { DrillCall } from "../components/DrillCall";
import { ProgressPips } from "../components/ProgressPips";
import { BOSS_LIVES } from "../domain/levels";
import type { Sprint, SprintResult } from "../domain/sprint";
import { comboMultiplier } from "../domain/sprint";
import { useProgress } from "../hooks/useProgress";
import { microphoneService } from "../services";

const MAX_COMBO = 8;

interface DrillViewProps {
  sprint: Sprint;
  /** Called when the sprint is over: all items played, lives lost, or ended early. */
  onEnd: (results: SprintResult[]) => void;
}

export function DrillView({ sprint, onEnd }: DrillViewProps) {
  const { progress } = useProgress();
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<SprintResult[]>([]);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState<number | null>(sprint.level.isBoss ? BOSS_LIVES : null);
  const item = sprint.items[index];
  const micUsable = progress.settings.micOn && microphoneService.status === "ready";

  function handleGrade(grade: Grade) {
    if (!item) {
      return;
    }
    const nextResults = [...results, { item, grade }];
    const nextLives = lives !== null && grade === "miss" ? lives - 1 : lives;
    const isOver = index + 1 >= sprint.items.length || (nextLives !== null && nextLives <= 0);

    if (isOver) {
      onEnd(nextResults);
      return;
    }
    setResults(nextResults);
    setCombo(grade === "got" ? Math.min(combo + 1, MAX_COMBO) : 0);
    setLives(nextLives);
    setIndex(index + 1);
  }

  if (!item) {
    return null;
  }

  return (
    <section className="grid gap-4">
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
          <h2 className="text-xl font-bold font-stretch-semi-condensed">
            {sprint.levelIndex !== null && `Rung ${sprint.levelIndex + 1} · `}
            {sprint.level.name}
          </h2>
          <span className="font-mono font-bold text-live">
            {combo >= 2 && `combo ×${comboMultiplier(combo).toFixed(1)}`}
            {lives !== null && ` · lives ${"●".repeat(lives)}${"○".repeat(BOSS_LIVES - lives)}`}
          </span>
        </div>
        <ProgressPips
          total={sprint.items.length}
          grades={results.map((result) => result.grade)}
          currentIndex={index}
        />
      </div>
      <DrillCall
        key={`${index}:${item.id}`}
        item={item}
        level={sprint.level}
        settings={progress.settings}
        micUsable={micUsable}
        onGrade={handleGrade}
        onQuit={() => onEnd(results)}
      />
    </section>
  );
}
