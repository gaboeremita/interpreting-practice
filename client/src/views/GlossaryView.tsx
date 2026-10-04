import type { Lang } from "@isa-drill-room/shared";
import { useDeferredValue, useMemo, useState } from "react";
import { PageIntro } from "../components/ui/PageIntro";
import { Panel } from "../components/ui/Panel";
import type { GlossaryKind, GlossaryTerm } from "../domain/glossary";
import { buildGlossary, searchGlossary } from "../domain/glossary";
import { useDrillContent } from "../hooks/useDrillContent";
import { useProgress } from "../hooks/useProgress";
import { classNames } from "../lib/classNames";
import { displayOptions } from "../lib/text";
import { speechService } from "../services";

const FILTERS: Array<{ kind: GlossaryKind | "all"; label: string }> = [
  { kind: "all", label: "All" },
  { kind: "l4", label: "Medical terms" },
  { kind: "pain", label: "Pain words" },
];

export function GlossaryView() {
  const { bank } = useDrillContent();
  const terms = useMemo(() => buildGlossary(bank.all), [bank]);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<GlossaryKind | "all">("all");
  // Typing stays responsive while the few hundred rows re-filter behind it.
  const deferredQuery = useDeferredValue(query);
  const matches = useMemo(() => searchGlossary(terms, deferredQuery, kind), [terms, deferredQuery, kind]);

  const countOf = (filterKind: GlossaryKind | "all") =>
    filterKind === "all" ? terms.length : terms.filter((term) => term.kind === filterKind).length;

  return (
    <div className="grid gap-4">
      <PageIntro title="Glossary">
        Every term the drills use, with its Spanish rendering and what it means. Search in either language.
      </PageIntro>

      <Panel>
        <div className="grid gap-3">
          <label htmlFor="glossary-search" className="sr-only">
            Search the glossary
          </label>
          <input
            id="glossary-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search: dosis, chest pain, alivio…"
            autoComplete="off"
            className="w-full rounded-lg border border-line bg-canvas p-2.5 text-ink"
          />
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter terms">
            {FILTERS.map((filter) => (
              <button
                key={filter.kind}
                type="button"
                aria-pressed={filter.kind === kind}
                onClick={() => setKind(filter.kind)}
                className={classNames(
                  "rounded-full px-3 py-1 text-sm font-bold",
                  filter.kind === kind ? "bg-ink text-canvas" : "bg-surface-2 text-ink-soft",
                )}
              >
                {filter.label} <span className="font-mono">{countOf(filter.kind)}</span>
              </button>
            ))}
            <span className="ml-auto text-sm text-ink-soft" aria-live="polite">
              {matches.length} {matches.length === 1 ? "term" : "terms"}
            </span>
          </div>
        </div>
      </Panel>

      {matches.length === 0 ? (
        <p className="text-ink-soft">No terms match “{deferredQuery.trim()}”.</p>
      ) : (
        <ul className="grid overflow-hidden rounded-[10px] border border-line bg-surface">
          {matches.map((term) => (
            <GlossaryRow key={term.id} term={term} />
          ))}
        </ul>
      )}
    </div>
  );
}

function GlossaryRow({ term }: { term: GlossaryTerm }) {
  const { progress } = useProgress();

  function hear(text: string, lang: Lang) {
    void speechService.say(text, lang, progress.settings);
  }

  return (
    <li className="grid gap-1.5 border-b border-line p-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-x-6">
      <div className="flex items-start gap-2">
        <HearButton label={`Hear “${term.english}” in English`} onClick={() => hear(term.english, "en")} />
        <span className="font-bold">{term.english}</span>
      </div>
      <div className="flex items-start gap-2">
        <HearButton
          label={`Hear “${term.spanish}” in Spanish`}
          onClick={() => hear(displayOptions(term.spanish)[0] ?? term.spanish, "es")}
        />
        <span lang="es" className="text-accent">
          {term.spanish || "—"}
        </span>
      </div>
      {term.definition && <p className="text-sm text-ink-soft sm:col-span-2 sm:pl-8">{term.definition}</p>}
    </li>
  );
}

function HearButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-surface-2 text-xs text-ink-soft hover:text-ink"
    >
      <span aria-hidden="true">▶</span>
    </button>
  );
}
