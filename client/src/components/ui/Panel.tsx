import type { ReactNode } from "react";

export function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="grid gap-3 rounded-[10px] border border-line bg-surface p-5 [&_li]:max-w-[68ch] [&_p]:max-w-[68ch]">
      {title && <h3 className="text-xl font-bold font-stretch-semi-condensed">{title}</h3>}
      {children}
    </section>
  );
}
