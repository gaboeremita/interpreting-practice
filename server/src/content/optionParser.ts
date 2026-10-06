/**
 * Splits a glossary cell such as "dolor sordo, apagado / leve (crónico) [MX only]"
 * into every accepted wording.
 * Bracketed notes are dropped; a parenthesised part yields both the short and the long form.
 * A slash with a space beside it separates whole wordings, while one between two words swaps just that word:
 * "píldora/pastilla anticonceptiva" is "píldora anticonceptiva" or "pastilla anticonceptiva".
 */
export function parseAcceptedOptions(raw: string): string[] {
  const withoutNotes = raw.replace(/\[[^\]]*\]/g, "");
  const parts = withoutNotes
    .split(/[,;]|\.\s|\s+\/\s*|\s*\/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .flatMap(expandWordSwaps);

  const options = new Set<string>();
  for (const part of parts) {
    options.add(collapseSpaces(part.replace(/\s*\([^)]*\)\s*/g, " ")));
    if (part.includes("(")) {
      options.add(collapseSpaces(part.replace(/[()]/g, "")));
    }
  }

  return [...options].filter(Boolean);
}

/**
 * Turns each "a/b" word into its own wording. Several swaps with the same number of choices pair up in order,
 * as in "Infection/Disease (STI/STD)"; otherwise every combination counts.
 */
function expandWordSwaps(part: string): string[] {
  const words = part.split(/\s+/).map(wordChoices);
  const [firstSwap, ...otherSwaps] = words.filter((choices) => choices.length > 1);
  if (!firstSwap) {
    return [part];
  }

  if (otherSwaps.every((choices) => choices.length === firstSwap.length)) {
    return firstSwap.map((_, index) => words.map((choices) => choices[index] ?? choices[0]).join(" "));
  }

  return words.reduce<string[]>(
    (wordings, choices) =>
      wordings.flatMap((wording) => choices.map((choice) => `${wording} ${choice}`.trim())),
    [""],
  );
}

/** "(ECG/EKG)" gives "(ECG)" and "(EKG)"; a bare gender ending such as "baja/o" gives "baja" and "bajo". */
function wordChoices(word: string): string[] {
  const [, open, core, close] = /^(\(*)(.*?)(\)*)$/.exec(word) ?? ["", "", word, ""];
  const [first, ...others] = core.split("/").filter(Boolean);
  if (!first || others.length === 0) {
    return [word];
  }

  const choices = [
    first,
    ...others.map((other) => (/^[ao]s?$/.test(other) ? first.slice(0, -other.length) + other : other)),
  ];

  return choices.map((choice) => `${open}${choice}${close}`);
}

function collapseSpaces(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}
