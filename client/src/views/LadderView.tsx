import { MicBanner } from "../components/MicBanner";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import { Kbd } from "../components/ui/Kbd";
import { PageIntro } from "../components/ui/PageIntro";
import { isLevelUnlocked, LEVELS, nextLevelIndex, PASS_MARK } from "../domain/levels";
import { useProgress } from "../hooks/useProgress";

interface LadderViewProps {
  dueCount: number;
  onStartLevel: (levelIndex: number) => void;
  onStartMisses: () => void;
}

export function LadderView({ dueCount, onStartLevel, onStartMisses }: LadderViewProps) {
  const { progress, setUnlockAll } = useProgress();
  const { best, unlockAll } = progress;
  const nextIndex = nextLevelIndex(best, unlockAll);

  return (
    <div className="grid gap-5">
      <PageIntro title="One sprint. About three minutes.">
        Hear it, say your rendition out loud before the ring runs out, then check the exact glossary wording.
        Hit {Math.round(PASS_MARK * 100)}% on a rung to open the next one.
      </PageIntro>
      <MicBanner />
      <div className="flex flex-wrap gap-2.5">
        <Button variant="primary" size="lg" onClick={() => onStartLevel(nextIndex)}>
          Start rung {nextIndex + 1}: {LEVELS[nextIndex]?.name}
        </Button>
        <Button size="lg" disabled={dueCount === 0} onClick={onStartMisses}>
          Redo my misses ({dueCount})
        </Button>
      </div>

      <div className="grid gap-2">
        {LEVELS.map((level, index) => {
          const levelBest = best[String(index)];
          const isOpen = isLevelUnlocked(index, best, unlockAll);
          const timing = level.isBoss ? "75% time" : `${level.secondsPerItem}s each`;

          return (
            <button
              key={level.name}
              type="button"
              disabled={!isOpen}
              onClick={() => onStartLevel(index)}
              className="grid w-full grid-cols-[52px_1fr_auto] items-center gap-3.5 rounded-[10px] border border-line bg-surface px-4 py-3.5 text-left hover:enabled:border-accent disabled:cursor-not-allowed disabled:opacity-55 max-[520px]:grid-cols-[40px_1fr]"
            >
              <span className="font-display text-3xl leading-none font-black text-accent font-stretch-condensed">
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-[1.05rem] font-bold">{level.name}</span>
                <span className="text-sm text-ink-soft">
                  {level.description} · {level.itemCount} items · {timing}
                </span>
              </span>
              <span className="max-[520px]:col-start-2 max-[520px]:justify-self-start">
                {levelBest === undefined ? (
                  <Chip>{isOpen ? "open" : "locked"}</Chip>
                ) : (
                  <Chip tone={levelBest >= PASS_MARK ? "pass" : "try"}>
                    best {Math.round(levelBest * 100)}%
                  </Chip>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-4.5 gap-y-2.5 text-sm text-ink-soft">
        <span>
          Keys: <Kbd>Space</Kbd> reveal <Kbd>R</Kbd> replay <Kbd>1</Kbd> got it <Kbd>2</Kbd> close{" "}
          <Kbd>3</Kbd> missed
        </span>
        <button
          type="button"
          className="font-bold text-accent underline"
          onClick={() => setUnlockAll(!unlockAll)}
        >
          {unlockAll ? "Lock rungs again" : "Unlock every rung"}
        </button>
      </div>
    </div>
  );
}
