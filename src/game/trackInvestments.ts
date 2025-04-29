import { InvestmentConfig } from '../config/investmentsConfig';
import { ActiveInvestments } from '../types';

export function processInvestments(
  activeInvestments: ActiveInvestments,
  turnsRemaining: { [key: string]: number | undefined },
  completedInvestments: Set<string>,
  investmentConfigs: InvestmentConfig[]
) {
  const updatedTurns = { ...turnsRemaining };
  const newlyCompleted = new Set<string>();
  const updatedCompleted = new Set(completedInvestments);

  investmentConfigs.forEach(config => {
    const area = activeInvestments[config.name];
    const name = config.name;

    if (completedInvestments.has(name)) return;

    if (area.length === config.maxDevelopers) {
      if (updatedTurns[name] === undefined) {
        updatedTurns[name] = config.turnsToComplete - 1;
      } else {
        updatedTurns[name] = Math.max(0, updatedTurns[name]! - 1);
        if (updatedTurns[name] === 0) {
          newlyCompleted.add(name);
          updatedCompleted.add(name);
        }
      }
    } else {
      updatedTurns[name] = undefined;
    }
  });

  return { updatedTurns, updatedCompleted, newlyCompleted };
}