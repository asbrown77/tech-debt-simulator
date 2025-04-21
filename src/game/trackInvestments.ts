import { InvestmentConfig } from '../config/investments';
import { Developer } from '../types';

export function processInvestments(
  activeInvestments: { [key: string]: Developer[] },
  turnsRemaining: { [key: string]: number | undefined },
  completedInvestments: Set<string>,
  investmentConfigs: InvestmentConfig[]
) {
  const updatedTurns = { ...turnsRemaining };
  const newlyCompleted = new Set<string>();
  const updatedCompleted = new Set(completedInvestments);

  investmentConfigs.forEach(config => {
    const area = activeInvestments[config.name];
    const title = config.name;

    if (completedInvestments.has(title)) return;

    if (area.length === config.maxDevelopers) {
      if (updatedTurns[title] === undefined) {
        updatedTurns[title] = config.turnsToComplete - 1;
      } else {
        updatedTurns[title] = Math.max(0, updatedTurns[title]! - 1);
        if (updatedTurns[title] === 0) {
          newlyCompleted.add(title);
          updatedCompleted.add(title);
        }
      }
    } else {
      updatedTurns[title] = undefined;
    }
  });

  return { updatedTurns, updatedCompleted, newlyCompleted };
}