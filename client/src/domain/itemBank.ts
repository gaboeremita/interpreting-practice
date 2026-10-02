import type { DrillItem } from "@isa-drill-room/shared";

export interface ItemBank {
  l4FromEnglish: DrillItem[];
  l4FromSpanish: DrillItem[];
  pain: DrillItem[];
  warmUp: DrillItem[];
  sentences: DrillItem[];
  turns: DrillItem[];
  all: DrillItem[];
}

const WARM_UP_MAX_ANSWER_LENGTH = 14;
const WARM_UP_MAX_PROMPT_WORDS = 2;

export function buildItemBank(items: DrillItem[]): ItemBank {
  const l4FromEnglish = items.filter((item) => item.kind === "l4" && item.from === "en");

  return {
    l4FromEnglish,
    l4FromSpanish: items.filter((item) => item.kind === "l4" && item.from === "es"),
    pain: items.filter((item) => item.kind === "pain"),
    warmUp: l4FromEnglish.filter(
      (item) =>
        (item.accepted[0]?.length ?? Infinity) <= WARM_UP_MAX_ANSWER_LENGTH &&
        item.prompt.split(" ").length <= WARM_UP_MAX_PROMPT_WORDS,
    ),
    sentences: items.filter((item) => item.kind === "sen"),
    turns: items.filter((item) => item.kind === "turn"),
    all: items,
  };
}
