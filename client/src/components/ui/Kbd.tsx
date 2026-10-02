import type { ReactNode } from "react";

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="ml-1.5 rounded border border-b-2 border-line px-1.5 font-mono text-xs font-medium text-ink-soft">
      {children}
    </kbd>
  );
}
