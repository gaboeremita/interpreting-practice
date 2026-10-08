import type { SprintLength } from "@interpreting-practice/shared";
import { useState } from "react";
import {
  clampItemCount,
  itemCountFor,
  levelKey,
  LEVELS,
  MAX_SPRINT_ITEMS,
  MIN_SPRINT_ITEMS,
  MISSES_LEVEL,
  presetItemCount,
  SPRINT_LENGTHS,
} from "../domain/levels";
import { useDrillContent } from "../hooks/useDrillContent";
import { useProgress } from "../hooks/useProgress";
import { classNames } from "../lib/classNames";

const segmentClasses = "px-3.5 py-1.5 font-bold";

/** Picks a sprint length preset and, under "Customize", the item count of each rung. */
export function SprintLengthPanel() {
  const { bank } = useDrillContent();
  const { progress, updateSettings } = useProgress();
  const { sprintLength, itemCounts } = progress.settings;
  const [isCustomizing, setIsCustomizing] = useState(false);
  const isCustom = Object.keys(itemCounts).length > 0;
  const presetLabel = SPRINT_LENGTHS.find((length) => length.value === sprintLength)?.label ?? "";

  function choosePreset(value: SprintLength) {
    // A preset replaces every per-rung change.
    updateSettings({ sprintLength: value, itemCounts: {} });
  }

  function changeCount(levelIndex: number | null, count: number) {
    const level = levelIndex === null ? MISSES_LEVEL : LEVELS[levelIndex];
    if (!level) {
      return;
    }

    const key = levelKey(levelIndex);
    const others = Object.fromEntries(Object.entries(itemCounts).filter(([otherKey]) => otherKey !== key));
    // A count equal to the preset's isn't a change, so it doesn't make the length custom.
    updateSettings({
      itemCounts: count === presetItemCount(level, sprintLength) ? others : { ...others, [key]: count },
    });
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
        <span className="font-bold" id="sprint-length-label">
          Sprint length
        </span>
        <div
          role="group"
          aria-labelledby="sprint-length-label"
          className="flex overflow-hidden rounded-full border border-line bg-surface"
        >
          {SPRINT_LENGTHS.map((length) => {
            const isActive = !isCustom && length.value === sprintLength;
            return (
              <button
                key={length.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => choosePreset(length.value)}
                className={classNames(segmentClasses, isActive ? "bg-ink text-canvas" : "hover:bg-surface-2")}
              >
                {length.label}
              </button>
            );
          })}
          {isCustom && (
            <span aria-current="true" className={classNames(segmentClasses, "bg-ink text-canvas")}>
              Custom
            </span>
          )}
        </div>
        <button
          type="button"
          className="text-sm font-bold text-accent underline"
          aria-expanded={isCustomizing}
          onClick={() => setIsCustomizing(!isCustomizing)}
        >
          {isCustomizing ? "Done customizing" : "Customize each rung"}
        </button>
      </div>

      {isCustomizing && (
        <section className="grid gap-2.5 rounded-[10px] border border-line bg-surface p-4">
          <p className="text-sm text-ink-soft">
            Items per sprint. A rung can't hold more items than it has, so each one shows its maximum.
          </p>
          <ul className="grid gap-1.5">
            {LEVELS.map((level, index) => (
              <CountRow
                key={level.name}
                inputId={`rung-count-${index}`}
                label={`${index + 1}. ${level.name}`}
                count={itemCountFor(index, progress.settings)}
                max={level.pickPool(bank).length}
                isChanged={levelKey(index) in itemCounts}
                onCommit={(count) => changeCount(index, count)}
              />
            ))}
            <CountRow
              inputId="rung-count-misses"
              label="Redo my misses"
              count={itemCountFor(null, progress.settings)}
              max={null}
              isChanged={levelKey(null) in itemCounts}
              onCommit={(count) => changeCount(null, count)}
            />
          </ul>
          {isCustom && (
            <div>
              <button
                type="button"
                className="text-sm font-bold text-accent underline"
                onClick={() => choosePreset(sprintLength)}
              >
                Reset to {presetLabel}
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

interface CountRowProps {
  inputId: string;
  label: string;
  count: number;
  /** Items available to the rung, or null when it changes from day to day (misses). */
  max: number | null;
  isChanged: boolean;
  onCommit: (count: number) => void;
}

function CountRow({ inputId, label, count, max, isChanged, onCommit }: CountRowProps) {
  // Typing "12" passes through "1", which is below the minimum, so the field keeps its own text until it's left.
  const [draft, setDraft] = useState<string | null>(null);
  const limit = Math.max(MIN_SPRINT_ITEMS, Math.min(MAX_SPRINT_ITEMS, max ?? MAX_SPRINT_ITEMS));

  function commit() {
    if (draft === null) {
      return;
    }

    const typed = Number(draft);
    setDraft(null);
    if (draft.trim() !== "" && Number.isFinite(typed)) {
      onCommit(Math.min(limit, clampItemCount(typed)));
    }
  }

  return (
    <li className="grid grid-cols-[1fr_auto_5.5rem] items-center gap-3 max-[520px]:grid-cols-[1fr_auto]">
      <label htmlFor={inputId} className={classNames(isChanged && "font-bold")}>
        {label}
      </label>
      <input
        id={inputId}
        type="number"
        inputMode="numeric"
        min={MIN_SPRINT_ITEMS}
        max={limit}
        value={draft ?? String(count)}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            commit();
          }
        }}
        className="w-20 rounded-lg border border-line bg-canvas px-2 py-1 text-right font-mono text-ink"
      />
      <span className="text-sm text-ink-soft max-[520px]:col-span-2">
        {max === null ? "your due items" : `max ${limit}`}
      </span>
    </li>
  );
}
