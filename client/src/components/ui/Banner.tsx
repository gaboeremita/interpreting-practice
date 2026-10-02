import type { ReactNode } from "react";
import { classNames } from "../../lib/classNames";

export function Banner({ tone = "warn", children }: { tone?: "warn" | "ok"; children: ReactNode }) {
  return (
    <div
      role="status"
      className={classNames(
        "rounded-[10px] px-3.5 py-3 font-bold",
        tone === "ok" ? "bg-good-bg text-good" : "bg-warn-bg text-warn",
      )}
    >
      {children}
    </div>
  );
}
