import type { Grade } from "@interpreting-practice/shared";
import { classNames } from "../lib/classNames";

const GRADE_CLASSES: Record<Grade, string> = { got: "bg-good", close: "bg-warn", miss: "bg-bad" };

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
    <div className="flex flex-wrap gap-1" aria-label={`Item ${currentIndex + 1} of ${total}`}>
      {Array.from({ length: total }, (_, index) => {
        const grade = grades[index];
        return (
          <span
            key={index}
            className={classNames(
              "h-1.5 w-3.5 rounded-sm",
              grade ? GRADE_CLASSES[grade] : index === currentIndex ? "bg-ink" : "bg-surface-2",
            )}
          />
        );
      })}
    </div>
  );
}
