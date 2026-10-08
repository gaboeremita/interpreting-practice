import type { Grade } from "@interpreting-practice/shared";
import { classNames } from "../lib/classNames";

const GRADE_CLASSES: Record<Grade, string> = { got: "bg-good", close: "bg-warn", miss: "bg-bad" };
const TALLIES: Array<{ grade: Grade; label: string; className: string }> = [
  { grade: "got", label: "got", className: "text-good" },
  { grade: "close", label: "close", className: "text-warn" },
  { grade: "miss", label: "missed", className: "text-bad" },
];

/** Sprint progress: one segment per item, coloured by its grade, with the current item in the accent colour. */
export function ProgressPips({
  total,
  grades,
  currentIndex,
}: {
  total: number;
  grades: Grade[];
  currentIndex: number;
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm text-ink-soft">
        <span>
          Item <b className="font-mono text-ink">{currentIndex + 1}</b>
          <span className="font-mono"> / {total}</span>
        </span>
        <span className="flex gap-3 font-mono">
          {TALLIES.map(({ grade, label, className }) => (
            <span key={grade}>
              <b className={className}>{grades.filter((each) => each === grade).length}</b> {label}
            </span>
          ))}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Sprint progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={grades.length}
        aria-valuetext={`Item ${currentIndex + 1} of ${total}`}
        className="flex h-2.5 gap-0.5 overflow-hidden rounded-full"
      >
        {Array.from({ length: total }, (_, index) => {
          const grade = grades[index];
          return (
            <span
              key={index}
              className={classNames(
                "min-w-0 flex-1 transition-colors duration-300",
                grade ? GRADE_CLASSES[grade] : index === currentIndex ? "bg-accent" : "bg-surface-2",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
