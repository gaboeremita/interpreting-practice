const STORAGE_KEY = "isa-drill-learner-id";

/**
 * Anonymous id that ties this browser to its saved progress on the server.
 * Falls back to a per-visit id when storage is blocked (private windows, strict settings).
 */
export function getLearnerId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
      return existing;
    }
    const created = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, created);

    return created;
  } catch {
    return crypto.randomUUID();
  }
}
