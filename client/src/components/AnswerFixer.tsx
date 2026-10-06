import type { ContentResponse, DrillItem } from "@interpreting-practice/shared";
import { useState } from "react";
import { drillApi } from "../api/drillApi";
import { errorMessageOf } from "../api/httpClient";
import { useDrillContent } from "../hooks/useDrillContent";
import { Button } from "./ui/Button";

interface AnswerFixerProps {
  item: DrillItem;
  /** Called with the item as the API now serves it. */
  onFixed: (item: DrillItem) => void;
}

/** Lets the learner correct an answer the glossary or a model rendition gets wrong. */
export function AnswerFixer({ item, onFixed }: AnswerFixerProps) {
  const { replaceContent } = useDrillContent();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.display);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const isLine = item.units !== null;

  async function apply(request: Promise<ContentResponse>) {
    setSaving(true);
    setError("");
    try {
      const content = await request;
      replaceContent(content);
      const updated = content.items.find((candidate) => candidate.id === item.id);
      if (updated) {
        onFixed(updated);
        setDraft(updated.display);
      }
      setEditing(false);
    } catch (caught) {
      setError(errorMessageOf(caught));
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <div className="flex flex-wrap items-center gap-2.5 text-sm text-ink-soft">
        {item.original !== undefined && <span>You fixed this answer. Original: {item.original}</span>}
        <button type="button" className="underline" onClick={() => setEditing(true)}>
          {item.original !== undefined ? "Edit your fix" : "Wrong answer? Fix it"}
        </button>
        {item.original !== undefined && (
          <button
            type="button"
            className="underline"
            disabled={saving}
            onClick={() => void apply(drillApi.restoreAnswer(item.id))}
          >
            Restore original
          </button>
        )}
        {error && <span className="text-bad">{error}</span>}
      </div>
    );
  }

  return (
    <form
      className="grid gap-1.5"
      onSubmit={(event) => {
        event.preventDefault();
        void apply(drillApi.fixAnswer(item.id, draft));
      }}
    >
      <label htmlFor="answer-fix" className="text-sm text-ink-soft">
        {isLine
          ? "Correct model rendition"
          : "Correct answer. Separate accepted alternatives with commas or a slash."}
      </label>
      {isLine ? (
        <textarea
          id="answer-fix"
          autoFocus
          rows={3}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="w-full rounded-lg border border-line bg-canvas p-2.5 text-ink"
        />
      ) : (
        <input
          id="answer-fix"
          autoFocus
          autoComplete="off"
          spellCheck={false}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="w-full rounded-lg border border-line bg-canvas p-2.5 text-ink"
        />
      )}
      <div className="flex flex-wrap items-center gap-2.5">
        <Button type="submit" variant="primary" disabled={saving || !draft.trim()}>
          Save fix
        </Button>
        <Button
          onClick={() => {
            setEditing(false);
            setDraft(item.display);
            setError("");
          }}
        >
          Cancel
        </Button>
        {error && <span className="text-sm text-bad">{error}</span>}
      </div>
    </form>
  );
}
