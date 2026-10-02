import type { ReactNode } from "react";
import { classNames } from "../../lib/classNames";

type Tone = "neutral" | "pass" | "try";

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-surface-2 text-ink-soft",
  pass: "bg-good-bg text-good",
  try: "bg-warn-bg text-warn",
};

export function Chip({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={classNames(
        "rounded-full px-2.5 py-0.5 font-mono text-xs whitespace-nowrap",
        TONE_CLASSES[tone],
      )}
    >
      {children}
    </span>
  );
}
