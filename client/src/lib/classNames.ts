/** Joins the truthy class names, so conditional Tailwind classes read cleanly. */
export function classNames(...names: Array<string | false | null | undefined>): string {
  return names.filter(Boolean).join(" ");
}
