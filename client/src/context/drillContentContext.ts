import type { QuizQuestion } from "@isa-drill-room/shared";
import { createContext } from "react";
import type { ItemBank } from "../domain/itemBank";

export interface DrillContent {
  bank: ItemBank;
  quiz: QuizQuestion[];
}

export const DrillContentContext = createContext<DrillContent | null>(null);
