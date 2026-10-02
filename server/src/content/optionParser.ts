/**
 * Splits a glossary cell such as "dolor sordo, apagado / leve (crónico) [MX only]"
 * into every wording a rater accepts.
 * Bracketed notes are dropped; a parenthesised part yields both the short and the long form.
 */
export function parseAcceptedOptions(raw: string): string[] {
  const withoutNotes = raw.replace(/\[[^\]]*\]/g, "");
  const parts = withoutNotes
    .split(/[,;/]|\.\s/)
    .map((part) => part.trim())
    .filter(Boolean);

  const options = new Set<string>();
  for (const part of parts) {
    options.add(collapseSpaces(part.replace(/\s*\([^)]*\)\s*/g, " ")));
    if (part.includes("(")) {
      options.add(collapseSpaces(part.replace(/[()]/g, "")));
    }
  }

  return [...options].filter(Boolean);
}

function collapseSpaces(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}
