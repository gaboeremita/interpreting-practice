import { useState } from "react";
import { QuizPanel } from "../components/QuizPanel";
import { ScriptDrill } from "../components/ScriptDrill";
import { Button } from "../components/ui/Button";
import { PageIntro } from "../components/ui/PageIntro";
import { Panel } from "../components/ui/Panel";
import { useDrillContent } from "../hooks/useDrillContent";
import { useProgress } from "../hooks/useProgress";

export function ProtocolView() {
  const { quiz } = useDrillContent();
  const { progress, saveScripts } = useProgress();
  const [draft, setDraft] = useState(progress.scripts);
  const [savedNote, setSavedNote] = useState("");

  async function handleSave() {
    const saved = await saveScripts(draft);
    setSavedNote(saved ? "Saved." : "");
  }

  return (
    <div className="grid gap-4">
      <PageIntro title="Protocol is scored too.">
        The ISA grades interpretation protocol and customer service skills alongside terminology. Eight quick
        scenarios, then drill your school's exact scripts.
      </PageIntro>
      <QuizPanel questions={quiz} />
      <Panel title="Your exact scripts">
        <p>
          Paste the scripts from your Interpreter School materials, one per line (opening, clarification,
          closing, and so on). They aren't filled in for you: the published versions differ by account, and
          you need the wording your rater will hear.
        </p>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="One script per line"
          className="min-h-40 w-full rounded-lg border border-line bg-canvas p-3 text-ink"
        />
        <div className="flex flex-wrap items-center gap-2.5">
          <Button onClick={() => void handleSave()}>Save scripts</Button>
          <span className="text-sm text-ink-soft">{savedNote}</span>
        </div>
        <ScriptDrill key={progress.scripts} scripts={progress.scripts} />
      </Panel>
    </div>
  );
}
