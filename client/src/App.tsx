import type { ContentResponse } from "@interpreting-practice/shared";
import { useMemo, useState } from "react";
import type { TabName } from "./components/TopBar";
import { TopBar } from "./components/TopBar";
import { Banner } from "./components/ui/Banner";
import { Button } from "./components/ui/Button";
import type { DrillContent } from "./context/drillContentContext";
import { DrillContentContext } from "./context/drillContentContext";
import { ProgressProvider } from "./context/ProgressProvider";
import { buildItemBank } from "./domain/itemBank";
import { missedItems } from "./domain/sprint";
import { useBootstrap } from "./hooks/useBootstrap";
import { useDrillContent } from "./hooks/useDrillContent";
import { useProgress } from "./hooks/useProgress";
import { getLearnerId } from "./lib/learnerId";
import { GlossaryView } from "./views/GlossaryView";
import { PhrasesView } from "./views/PhrasesView";
import { PlanView } from "./views/PlanView";
import { ProtocolView } from "./views/ProtocolView";
import { SettingsView } from "./views/SettingsView";
import { TrainingScreen } from "./views/TrainingScreen";

export function App() {
  const [learnerId] = useState(getLearnerId);
  const bootstrap = useBootstrap(learnerId);
  const [replacedContent, setReplacedContent] = useState<ContentResponse | null>(null);
  const response = replacedContent ?? (bootstrap.status === "ready" ? bootstrap.content : null);
  const content = useMemo<DrillContent | null>(
    () =>
      response
        ? { bank: buildItemBank(response.items), quiz: response.quiz, replaceContent: setReplacedContent }
        : null,
    [response],
  );

  return (
    <div className="mx-auto max-w-[980px] px-4 pb-12">
      {bootstrap.status === "loading" && <p className="py-10 text-ink-soft">Loading the drill room…</p>}
      {bootstrap.status === "error" && (
        <div className="grid justify-items-start gap-3 py-10">
          <Banner>{bootstrap.message}</Banner>
          <Button variant="primary" onClick={bootstrap.retry}>
            Try again
          </Button>
        </div>
      )}
      {bootstrap.status === "ready" && content && (
        <DrillContentContext value={content}>
          <ProgressProvider learnerId={learnerId} initialProgress={bootstrap.progress}>
            <AppShell />
          </ProgressProvider>
        </DrillContentContext>
      )}
    </div>
  );
}

function AppShell() {
  const { bank } = useDrillContent();
  const { progress, syncError, dismissSyncError } = useProgress();
  const [activeTab, setActiveTab] = useState<TabName>("ladder");
  const dueCount = useMemo(() => missedItems(bank.all, progress.boxes).length, [bank, progress.boxes]);

  return (
    <>
      <TopBar
        xp={progress.xp}
        streakDays={progress.streak.count}
        dueCount={dueCount}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />
      <main className="mt-6 grid gap-4">
        {syncError && (
          <Banner>
            <span className="flex flex-wrap items-center justify-between gap-2">
              {syncError}
              <button type="button" className="underline" onClick={dismissSyncError}>
                Dismiss
              </button>
            </span>
          </Banner>
        )}
        {activeTab === "ladder" && <TrainingScreen dueCount={dueCount} />}
        {activeTab === "glossary" && <GlossaryView />}
        {activeTab === "phrases" && <PhrasesView />}
        {activeTab === "protocol" && <ProtocolView />}
        {activeTab === "plan" && <PlanView />}
        {activeTab === "settings" && <SettingsView />}
      </main>
    </>
  );
}
