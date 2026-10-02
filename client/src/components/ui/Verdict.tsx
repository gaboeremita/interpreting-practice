import type { Grade } from "@isa-drill-room/shared";
import type { ReactNode } from "react";
import { classNames } from "../../lib/classNames";

const TONE_CLASSES: Record<Grade, string> = {
  got: "bg-good-bg text-good",
  close: "bg-warn-bg text-warn",
  miss: "bg-bad-bg text-bad",
};

export function Verdict({ tone, children }: { tone: Grade; children: ReactNode }) {
  return <div className={classNames("rounded-lg px-3 py-2 font-bold", TONE_CLASSES[tone])}>{children}</div>;
}
