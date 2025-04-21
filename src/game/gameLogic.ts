import { Developer } from '../types';
import { InvestmentConfig, BASE_TECH_DEBT } from '../config/investments';
import { processInvestments } from './trackInvestments';
import { calculateRelease } from './calculateRelease';
import { uniqueDevelopers } from '../utils/helpers';
import { SprintData } from '../types';


export function handleBeginTurnLogic(
  activeInvestments: { [key: string]: Developer[] },
  investmentConfigs: InvestmentConfig[],
  turnsRemaining: { [key: string]: number | undefined },
  completedInvestments: Set<string>,
  developers: Developer[],
  mainArea: Developer[],
  resultHistory: SprintData[],
  currentSprint: number,
  techDebt: number
) {
  const { updatedTurns, updatedCompleted, newlyCompleted } = processInvestments(
    activeInvestments,
    turnsRemaining,
    completedInvestments,
    investmentConfigs
  );

  let updatedDevelopers = [...developers];
  let updatedMainArea = [...mainArea];
  let updatedActiveInvestments = { ...activeInvestments };
  let updatedTechDebt = techDebt;

  newlyCompleted.forEach(name => {
    const investment = investmentConfigs.find(i => i.name === name)!;
    const completedDevelopers = activeInvestments[name];

    const currentUnits = Math.ceil((updatedTechDebt * BASE_TECH_DEBT) / 100);
    const newUnits = Math.max(0, currentUnits - (investment.techDebtReduction ?? 0));
    updatedTechDebt = (newUnits * 100) / BASE_TECH_DEBT;

    updatedDevelopers = uniqueDevelopers([...updatedDevelopers, ...completedDevelopers]);
    updatedActiveInvestments[name] = [];

    if (investment.increaseValue) {
      const all = [
        ...updatedDevelopers,
        ...updatedMainArea,
        ...Object.values(activeInvestments).flat(),
        ...completedDevelopers
      ];
      const increaseValueDeveloperMap = new Map<number, Developer>();
      for (const m of all) {
        increaseValueDeveloperMap.set(m.id, { ...m, value: m.value + 1 });
      }

      updatedDevelopers = updatedDevelopers.map(m => increaseValueDeveloperMap.get(m.id) ?? m);
      updatedMainArea = updatedMainArea.map(m => increaseValueDeveloperMap.get(m.id) ?? m);
      updatedActiveInvestments = Object.entries(updatedActiveInvestments).reduce((acc, [key, value]) => {
        acc[key] = value.map(m => increaseValueDeveloperMap.get(m.id) ?? m);
        return acc;
      }, {} as typeof activeInvestments);
    }
  });

  // Calculate confidence
  let confidence = 10;
  if (updatedCompleted.has('CI/CD')) confidence += 65;
  if (updatedCompleted.has('Test Coverage')) confidence += 25;
  confidence = Math.min(confidence, 100);

  // Generate value from build area
  let totalValue = 0;
  updatedMainArea.forEach(m => {
    totalValue += Math.floor(Math.random() * m.value) + 1;
  });

  if (updatedCompleted.has('CI/CD')) {
    totalValue += updatedMainArea.length;
  }

  const bugs = Math.max(0, Math.floor((updatedTechDebt - 80) / 10));
  const netValue = totalValue - bugs;

  let delivered = resultHistory.at(-1)?.totalValueDelivered || 0;
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
    totalValueDelivered: delivered,
    released
  };

  return {
    updatedTurns,
    updatedCompleted,
    updatedDevelopers,
    updatedMainArea,
    updatedActiveInvestments,
    updatedTechDebt,
    newSprint
  };
}
