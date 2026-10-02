export function randomItem<T>(list: readonly T[]): T | undefined {
  return list[Math.floor(Math.random() * list.length)];
}

/** Fisher–Yates shuffle that returns a new array. */
export function shuffled<T>(list: readonly T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }

  return copy;
}
