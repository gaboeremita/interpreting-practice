import type { ReactNode } from "react";

/** Small uppercase label above a block of content. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="text-xs font-bold tracking-widest text-ink-soft uppercase">{children}</div>;
}
