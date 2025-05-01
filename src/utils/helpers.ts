import { Developer, SprintData } from "../types";

export const BASE_RELEASE_CONFIDENCE = 20;
export const BASE_TECH_DEBT = 50;

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
        techDebt: BASE_TECH_DEBT,
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

  export const resetDeveloper = (developer: Developer): Developer => ({
    ...developer,
    output: null,
    hasBug: null,
    working: false,
  });

  export const getTechDebtLetter = (value: number, maxValue: number): string => {
    const percentage = (value / maxValue) * 100;
  
    if (percentage < 5) return 'A'; // Less than 5%
    if (percentage <= 10) return 'B'; // 6–10%
    if (percentage <= 20) return 'C'; // 11–20%
    if (percentage <= 50) return 'D'; // 21–50%
    return 'E'; // Greater than 50%
  };

export const getTechDebtColor = (value: number, maxValue: number): string => {
  const percentage = (value / maxValue) * 100;

  if (percentage < 5) return '#4caf50'; // Green for A
  if (percentage <= 10) return '#8bc34a'; // Light green for B
  if (percentage <= 20) return '#ffeb3b'; // Yellow for C
  if (percentage <= 50) return '#ff9800'; // Orange for D
  return '#f44336'; // Red for E
};