import { Developer } from '../types';
import { BASE_TECH_DEBT } from '../utils/helpers';

export function resetDevelopers(developers: Developer[]) {
  return developers.map((dev) => ({ ...dev, output: null, hasBug: false }));
}

export function calculateDeveloperOutput(
  developers: Developer[],
  developerPower: number,
  techDebt: number
) {
  let totalValue = 0;
  let bugs = 0;

  const clampedDebt = Math.min(100, Math.max(0, techDebt*2));
  const bugChance = 5 + (clampedDebt * 0.9); // From 5% to 95%

  const updatedDevelopers = developers.map((dev) => {
    if (developerPower <= 0) {
      return { ...dev, output: null, hasBug: false }; }

    const output = Math.floor(Math.random() * developerPower) + 1;
    const hasBug = Math.random() * 100 < bugChance;

    if (hasBug) bugs++;
    totalValue += output;

    return { ...dev, output, hasBug };
  });

  return { updatedDevelopers, devValue: totalValue, bugs };
}

// Add this line to fix TS1208
export {};