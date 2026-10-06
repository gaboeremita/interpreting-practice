import type { Lang } from "@interpreting-practice/shared";
import { useDeferredValue, useMemo, useState } from "react";
import { PageIntro } from "../components/ui/PageIntro";
import { Panel } from "../components/ui/Panel";
import type { Phrase, PhraseKind } from "../domain/phrases";
import { buildPhrases, searchPhrases } from "../domain/phrases";
import { useDrillContent } from "../hooks/useDrillContent";
import { useProgress } from "../hooks/useProgress";
import { classNames } from "../lib/classNames";
import { speechService } from "../services";

const FILTERS: Array<{ kind: PhraseKind | "all"; label: string }> = [
  { kind: "all", label: "All" },
  { kind: "sen", label: "Sentences" },
  { kind: "turn", label: "Conversation turns" },
];

export function PhrasesView() {
  const { bank } = useDrillContent();
  const phrases = useMemo(() => buildPhrases(bank.all), [bank]);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<PhraseKind | "all">("all");
  const deferredQuery = useDeferredValue(query);
  const matches = useMemo(() => searchPhrases(phrases, deferredQuery, kind), [phrases, deferredQuery, kind]);

  const countOf = (filterKind: PhraseKind | "all") =>
    filterKind === "all" ? phrases.length : phrases.filter((phrase) => phrase.kind === filterKind).length;

  return (
    <div className="grid gap-4">
      <PageIntro title="Phrases">
        Every sentence and conversation turn the drills use, with the model rendering. Search in either
        language.
      </PageIntro>

      <Panel>
        <div className="grid gap-3">
          <label htmlFor="phrases-search" className="sr-only">
            Search the phrases
          </label>
          <input
            id="phrases-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search: blood pressure, ayunar, medicine…"
            autoComplete="off"
            className="w-full rounded-lg border border-line bg-canvas p-2.5 text-ink"
          />
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter phrases">
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
              {matches.length} {matches.length === 1 ? "phrase" : "phrases"}
            </span>
          </div>
        </div>
      </Panel>

      {matches.length === 0 ? (
        <p className="text-ink-soft">No phrases match “{deferredQuery.trim()}”.</p>
      ) : (
        <ul className="grid overflow-hidden rounded-[10px] border border-line bg-surface">
          {matches.map((phrase) => (
            <PhraseRow key={phrase.id} phrase={phrase} />
          ))}
        </ul>
      )}
    </div>
  );
}

function PhraseRow({ phrase }: { phrase: Phrase }) {
  const { progress } = useProgress();
  const target: Lang = phrase.from === "en" ? "es" : "en";

  function hear(text: string, lang: Lang) {
    void speechService.say(text, lang, progress.settings);
  }

  return (
    <li className="grid gap-2 border-b border-line p-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-x-6">
      <div className="flex items-start gap-2">
        <HearButton label="Hear the original" onClick={() => hear(phrase.prompt, phrase.from)} />
        <div className="grid gap-0.5">
          {phrase.speaker && (
            <span className="text-xs font-bold tracking-wider text-ink-soft uppercase">{phrase.speaker}</span>
          )}
          <span lang={phrase.from} className="font-bold">
            {phrase.prompt}
          </span>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <HearButton label="Hear the model rendering" onClick={() => hear(phrase.model, target)} />
        <span lang={target} className="text-accent">
          {phrase.model}
        </span>
      </div>
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
