import type { Progress, SessionSubmission, Settings } from "@isa-drill-room/shared";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { drillApi } from "../api/drillApi";
import { errorMessageOf } from "../api/httpClient";
import { todayIsoDate } from "../lib/localDate";
import type { ProgressContextValue } from "./progressContext";
import { ProgressContext } from "./progressContext";

/** Sliders fire on every pixel; settings are saved once the learner stops changing them. */
const SETTINGS_SAVE_DELAY_MS = 400;

interface ProgressProviderProps {
  learnerId: string;
  initialProgress: Progress;
  children: ReactNode;
}

export function ProgressProvider({ learnerId, initialProgress, children }: ProgressProviderProps) {
  const [progress, setProgress] = useState(initialProgress);
  const [syncError, setSyncError] = useState<string | null>(null);
  const pendingSettings = useRef<Partial<Settings>>({});
  const settingsTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const attempt = useCallback(async <T,>(task: () => Promise<T>): Promise<T | null> => {
    try {
      const result = await task();
      setSyncError(null);
      return result;
    } catch (error) {
      setSyncError(errorMessageOf(error));
      return null;
    }
  }, []);

  const flushSettings = useCallback(() => {
    clearTimeout(settingsTimer.current);
    const changes = pendingSettings.current;
    pendingSettings.current = {};
    if (Object.keys(changes).length > 0) {
      void attempt(() => drillApi.updateSettings(learnerId, changes));
    }
  }, [attempt, learnerId]);

  useEffect(() => flushSettings, [flushSettings]);

  const submitSession = useCallback(
    async (submission: Omit<SessionSubmission, "playedOn">) => {
      const outcome = await attempt(() =>
        drillApi.submitSession(learnerId, { ...submission, playedOn: todayIsoDate() }),
      );
      if (outcome) {
        setProgress(outcome.progress);
      }
      return outcome;
    },
    [attempt, learnerId],
  );

  const updateSettings = useCallback(
    (changes: Partial<Settings>) => {
      setProgress((current) => ({ ...current, settings: { ...current.settings, ...changes } }));
      pendingSettings.current = { ...pendingSettings.current, ...changes };
      clearTimeout(settingsTimer.current);
      settingsTimer.current = setTimeout(flushSettings, SETTINGS_SAVE_DELAY_MS);
    },
    [flushSettings],
  );

  const saveScripts = useCallback(
    async (scripts: string) => {
      const saved = await attempt(() => drillApi.saveScripts(learnerId, scripts));
      if (saved) {
        setProgress((current) => ({ ...current, scripts: saved.scripts }));
      }
      return saved !== null;
    },
    [attempt, learnerId],
  );

  const setUnlockAll = useCallback(
    (unlockAll: boolean) => {
      setProgress((current) => ({ ...current, unlockAll }));
      void attempt(() => drillApi.setUnlockAll(learnerId, unlockAll));
    },
    [attempt, learnerId],
  );

  const resetProgress = useCallback(async () => {
    const reset = await attempt(() => drillApi.resetProgress(learnerId));
    if (reset) {
      setProgress(reset);
    }
    return reset !== null;
  }, [attempt, learnerId]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      syncError,
      dismissSyncError: () => setSyncError(null),
      submitSession,
      updateSettings,
      saveScripts,
      setUnlockAll,
      resetProgress,
    }),
    [progress, syncError, submitSession, updateSettings, saveScripts, setUnlockAll, resetProgress],
  );

  return <ProgressContext value={value}>{children}</ProgressContext>;
}
