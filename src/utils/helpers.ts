import { Developer, SprintData } from "../types";

export const BASE_RELEASE_CONFIDENCE = 20;

export function uniqueDevelopers(developers: Developer[]): Developer[] {
    const seen = new Map<number, Developer>();
    for (const m of developers) {
      const existing = seen.get(m.id);
      if (!existing) {
        seen.set(m.id, m);
      }
    }
    return Array.from(seen.values());
  }


  export function generateStartingHistory(sprints: number): SprintData[] {
    const history: SprintData[] = [];
  
    for (let i = 1; i <= sprints; i++) {
      history.push({
        sprintNumber: i,
        techDebt: 100, // high tech debt
        releaseConfidence: BASE_RELEASE_CONFIDENCE, // low release chance
        devValue: Math.floor(Math.random() * 10) + 5, // small random outputs
        bugs: Math.floor(Math.random() * 5) + 2, // few bugs each sprint
        netValue: 0, // assume very little value delivered
        released: false,
        accumulatedValueDelivered: 0,
      });
    }
  
    return history;
  }
  