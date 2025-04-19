import { Meeple } from '../types';
import { InvestmentConfig } from '../config/investments';
import { BASE_TECH_DEBT } from '../config/investments';
import { uniqueMeeples } from './helpers';

export type SprintData = {
  sprintNumber: number;
  techDebt: number;
  releaseConfidence: number;
  devOutput: number;
  netValue: number;
  delivered: number;
  bugs: number;
  released: boolean;
};

export function handleBeginTurnLogic(
  activeInvestments: { [key: string]: Meeple[] },
  investmentConfigs: InvestmentConfig[],
  turnsRemaining: { [key: string]: number | undefined },
  completedInvestments: Set<string>,
  techDebt: number,
  meeples: Meeple[],
  mainArea: Meeple[],
  resultHistory: SprintData[],
  currentSprint: number
) {
  const updatedTurns = { ...turnsRemaining };
  const newlyCompleted = new Set<string>();
  const updatedCompleted = new Set(completedInvestments);

  investmentConfigs.forEach(config => {
    const area = activeInvestments[config.name];
    const title = config.name;

    if (completedInvestments.has(title)) return;

    if (area.length === config.maxMeeples) {
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

  let updatedMeeples = [...meeples];
  let updatedMainArea = [...mainArea];
  let updatedActiveInvestments = { ...activeInvestments };
  let updatedTechDebt = techDebt;

  newlyCompleted.forEach(name => {
    const investment = investmentConfigs.find(i => i.name === name)!;
    const completedMeeples = activeInvestments[name];

    // Tech debt reduction
    const currentUnits = Math.ceil((updatedTechDebt * BASE_TECH_DEBT) / 100);
    const newUnits = Math.max(0, currentUnits - (investment.techDebtReduction ?? 0));
    updatedTechDebt = (newUnits * 100) / BASE_TECH_DEBT;

    // Return completed meeples
    updatedMeeples = uniqueMeeples([...updatedMeeples, ...completedMeeples]);
    updatedActiveInvestments[name] = [];

    if (investment.increaseValue) {
      const all = [...updatedMeeples, ...updatedMainArea, ...Object.values(activeInvestments).flat(), ...completedMeeples];
      const increaseValueMeepleMap = new Map<number, Meeple>();
      for (const m of all) {
        increaseValueMeepleMap.set(m.id, { ...m, value: m.value + 1 });
      }
        const increaseValueMeepleList = Array.from(increaseValueMeepleMap.values());
        
        // Track all updated meeples across all areas
        const allCurrentMeeples = [
            ...updatedMeeples,
            ...updatedMainArea,
            ...Object.values(updatedActiveInvestments).flat(),
            ...completedMeeples
        ];
        
        // Replace values using updatedMeeples, updatedMainArea, and updatedActiveInvestments
        updatedMeeples = updatedMeeples.map(m => increaseValueMeepleMap.get(m.id) ?? m);
        updatedMainArea = updatedMainArea.map(m => increaseValueMeepleMap.get(m.id) ?? m);
        updatedActiveInvestments = Object.entries(updatedActiveInvestments).reduce((acc, [key, value]) => {
          acc[key] = value.map(m => increaseValueMeepleMap.get(m.id) ?? m);
          return acc;
      }, {} as typeof activeInvestments);
    }
  });

  // Confidence
  let confidence = 10;
  if (updatedCompleted.has('CI/CD')) confidence += 65;
  if (updatedCompleted.has('Test Coverage')) confidence += 25;
  confidence = Math.min(confidence, 100);

  // Value generation
  let totalValue = 0;
  updatedMainArea.forEach(m => {
    totalValue += Math.floor(Math.random() * m.value) + 1;
  });

  if (updatedCompleted.has('CI/CD')) {
    totalValue += updatedMainArea.length;
  }

  const bugs = Math.max(0, Math.floor((updatedTechDebt - 80) / 10));
  const netValue = totalValue - bugs;

  let delivered = resultHistory.at(-1)?.delivered || 0;
  let released = false;
  if (netValue >= 15) {
    const roll = Math.floor(Math.random() * 100) + 1;
    if (roll <= confidence) {
      released = true;
      delivered += netValue;
    }
  }

  const newSprint: SprintData = {
    sprintNumber: currentSprint + 1,
    techDebt: updatedTechDebt,
    releaseConfidence: confidence,
    devOutput: totalValue,
    netValue,
    bugs,
    delivered,
    released
  };

  return {
    updatedTurns,
    updatedCompleted,
    updatedMeeples,
    updatedMainArea,
    updatedActiveInvestments,
    updatedTechDebt,
    newSprint
  };
}


