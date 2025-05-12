import { Developer, SprintData } from "../types";
import { calculateDeveloperOutput } from '../game/developerLogic';
import { initialDevelopers } from '../config/developersConfig';

 export const BASE_RELEASE_PROBABILITY = 20;
 export const BASE_TECH_DEBT = 50;
export const STARING_DEV_POWER = 4;

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

  let accumulated = 0;

  for (let i = 1; i <= sprints; i++) {
    const { updatedDevelopers, devValue, bugs } = calculateDeveloperOutput(
      initialDevelopers,
      STARING_DEV_POWER             
    );

    const netValue = devValue - bugs;
    // debugger
    const released = Math.random() <= BASE_RELEASE_PROBABILITY / 100;
    const valueDelivered = released ? netValue : 0;
    accumulated += valueDelivered;
    //debugger

    history.push({
      sprintNumber: i,
      techDebt: BASE_TECH_DEBT,
      releaseProbability: BASE_RELEASE_PROBABILITY,
      devValue,
      bugs,
      netValue,
      released,
      accumulatedValueDelivered: accumulated,
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
  
    if (percentage < 10) return 'A'; // Less than 10%
    if (percentage <= 30) return 'B'; // 12–20%
    if (percentage <= 45) return 'C'; // 21–40%
    if (percentage <= 70) return 'D'; // 41–70%
    return 'E'; // Greater than 70%
  };

export const getTechDebtColor = (value: number, maxValue: number): string => {
  const percentage = (value / maxValue) * 100;

  if (percentage < 10) return '#4caf50'; // Green for A
  if (percentage <= 30) return '#8bc34a'; // Light green for B
  if (percentage <= 45) return '#ffeb3b'; // Yellow for C
  if (percentage <= 70) return '#ff9800'; // Orange for D
  return '#f44336'; // Red for E
};