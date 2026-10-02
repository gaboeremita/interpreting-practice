import { useContext } from "react";
import type { ProgressContextValue } from "../context/progressContext";
import { ProgressContext } from "../context/progressContext";

export function useProgress(): ProgressContextValue {
  const value = useContext(ProgressContext);
  if (!value) {
    throw new Error("useProgress must be used inside <ProgressProvider>.");
  }

  return value;
}
