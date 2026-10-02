import type { ContentResponse, Progress } from "@isa-drill-room/shared";
import { useCallback, useEffect, useState } from "react";
import { drillApi } from "../api/drillApi";
import { errorMessageOf } from "../api/httpClient";

type BootstrapState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; content: ContentResponse; progress: Progress };

/** Loads the drill content and this learner's progress before the app renders. */
export function useBootstrap(learnerId: string): BootstrapState & { retry: () => void } {
  const [state, setState] = useState<BootstrapState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([drillApi.getContent(), drillApi.getProgress(learnerId)])
      .then(([content, progress]) => {
        if (!cancelled) {
          setState({ status: "ready", content, progress });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({ status: "error", message: errorMessageOf(error) });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [learnerId, attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((count) => count + 1);
  }, []);

  return { ...state, retry };
}
