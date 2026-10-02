import { classNames } from "../lib/classNames";

export type TabName = "ladder" | "protocol" | "plan" | "settings";

const TABS: Array<{ name: TabName; label: string }> = [
  { name: "ladder", label: "Ladder" },
  { name: "protocol", label: "Protocol" },
  { name: "plan", label: "Game plan" },
  { name: "settings", label: "Settings" },
];

interface TopBarProps {
  xp: number;
  streakDays: number;
  dueCount: number;
  activeTab: TabName;
  onSelectTab: (tab: TabName) => void;
}

export function TopBar({ xp, streakDays, dueCount, activeTab, onSelectTab }: TopBarProps) {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-b border-line bg-canvas py-3.5">
      <div className="flex items-center gap-2.5">
        <span className="size-2.5 rounded-full bg-live ring-4 ring-live/25" aria-hidden="true" />
        <h1 className="text-[1.35rem] font-extrabold tracking-tight font-stretch-semi-condensed">
          ISA Drill Room
        </h1>
      </div>
      <div className="flex gap-4 text-sm text-ink-soft" aria-live="polite">
        <Stat label="XP" value={xp} />
        <Stat label="Streak" value={streakDays} suffix="d" />
        <Stat label="Due" value={dueCount} />
      </div>
      <nav className="flex flex-wrap gap-1" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.name}
            type="button"
            role="tab"
            aria-selected={tab.name === activeTab}
            onClick={() => onSelectTab(tab.name)}
            className={classNames(
              "rounded-full px-3.5 py-1.5 font-bold",
              tab.name === activeTab ? "bg-ink text-canvas" : "text-ink-soft",
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

function Stat({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <span>
      {label} <b className="font-mono text-ink">{value}</b>
      {suffix}
    </span>
  );
}
