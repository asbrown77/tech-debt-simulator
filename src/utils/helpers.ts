import { Meeple } from "../types";

export function uniqueMeeples(meeples: Meeple[]): Meeple[] {
    const seen = new Map<number, Meeple>();
    for (const m of meeples) {
      const existing = seen.get(m.id);
      if (!existing || m.value > existing.value) {
        seen.set(m.id, m);
      }
    }
    return Array.from(seen.values());
  }