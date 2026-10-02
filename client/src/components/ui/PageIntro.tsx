import type { ReactNode } from "react";

export function PageIntro({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className="grid gap-1.5">
      <h2 className="text-[clamp(1.6rem,4vw,2.3rem)] font-extrabold font-stretch-condensed">{title}</h2>
      {children && <p className="max-w-[62ch] text-ink-soft">{children}</p>}
    </section>
  );
}
