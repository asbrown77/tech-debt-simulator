import { Developer, SprintData } from "../types";

export const BASE_RELEASE_CONFIDENCE = 20;
export const BASE_TECH_DEBT = 5;

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
      const devValue = Math.floor(Math.random() * 10) + 5; // Random dev output
      const bugs = Math.floor(Math.random() * 5) + 2; // Random bugs
      const netValue = devValue - bugs; // Calculate net value
      const released = Math.random() <= BASE_RELEASE_CONFIDENCE / 100; // 20% confidence for release
      const accumulatedValueDelivered = released
        ? (history.at(-1)?.accumulatedValueDelivered || 0) + netValue
        : history.at(-1)?.accumulatedValueDelivered || 0;
  
      history.push({
        sprintNumber: i,
        techDebt: BASE_TECH_DEBT, // High tech debt
        releaseConfidence: BASE_RELEASE_CONFIDENCE, // 20% release confidence
        devValue,
        bugs,
        netValue,
        released,
        accumulatedValueDelivered,
      });
    }
  
    return history;
  }