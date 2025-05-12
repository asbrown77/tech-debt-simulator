import { Developer } from '../types';
import { BASE_TECH_DEBT } from '../utils/helpers';

export function resetDevelopers(developers: Developer[]) {
  return developers.map((dev) => ({ ...dev, output: null, hasBug: false }));
}

export function calculateDeveloperOutput(
  developers: Developer[],
  developerPower: number
) {
  let totalValue = 0;
  let bugs = 0;

  const updatedDevelopers = developers.map((dev) => {

    debugger
    if (developerPower <= 0) {
      return { ...dev, output: null, hasBug: false }; }

    const output = Math.floor(Math.random() * developerPower) + 1;
    const roll = Math.random() * BASE_TECH_DEBT*20;
    const hasBug = roll <= (BASE_TECH_DEBT*20);

    if (hasBug) bugs++;
    totalValue += output;

    return { ...dev, output, hasBug };
  });

  return { updatedDevelopers, devValue: totalValue, bugs };
}

// Add this line to fix TS1208
export {};