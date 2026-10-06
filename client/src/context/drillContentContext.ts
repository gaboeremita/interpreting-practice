import type { ContentResponse, QuizQuestion } from "@interpreting-practice/shared";
import { createContext } from "react";
import type { ItemBank } from "../domain/itemBank";

export interface DrillContent {
  bank: ItemBank;
  quiz: QuizQuestion[];
  /** Swaps in content the API sent back, e.g. after the learner fixed an answer. */
  replaceContent: (content: ContentResponse) => void;
}

export const DrillContentContext = createContext<DrillContent | null>(null);
