import type { ReactNode } from "react";

export function SourceNote({ children }: { children: ReactNode }) {
  return <p className="text-sm text-ink-soft [&_a]:text-accent [&_a]:underline">{children}</p>;
}
