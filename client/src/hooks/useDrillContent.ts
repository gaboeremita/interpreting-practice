import { useContext } from "react";
import type { DrillContent } from "../context/drillContentContext";
import { DrillContentContext } from "../context/drillContentContext";

export function useDrillContent(): DrillContent {
  const value = useContext(DrillContentContext);
  if (!value) {
    throw new Error("useDrillContent must be used inside <DrillContentContext>.");
  }

  return value;
}
