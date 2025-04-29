import { Developer } from '../types';

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

  const updatedDevelopers = developers.map((dev) => {
    const output = Math.floor(Math.random() * developerPower) + 1;
    const roll = Math.random() * 100;
    const hasBug = roll <= techDebt;

    if (hasBug) bugs++;
    totalValue += output;

    return { ...dev, output, hasBug };
  });

  return { updatedDevelopers, totalValue, bugs };
}

// Add this line to fix TS1208
export {};