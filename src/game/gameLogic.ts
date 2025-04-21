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
  techDebt: number,
  developerPower: number
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
  let increasePower = false;

  newlyCompleted.forEach((name) => {
    const investment = investmentConfigs.find((i) => i.name === name)!;
    const completedDevelopers = activeInvestments[name];

    const currentUnits = Math.ceil((updatedTechDebt * BASE_TECH_DEBT) / 100);
    const newUnits = Math.max(0, currentUnits - (investment.techDebtReduction ?? 0));
    updatedTechDebt = (newUnits * 100) / BASE_TECH_DEBT;

    updatedDevelopers = uniqueDevelopers([...updatedDevelopers, ...completedDevelopers]);
    updatedActiveInvestments[name] = [];

    if (investment.increaseValue) {
      increasePower = true;
    }
  });

  // Calculate confidence
  let confidence = 10;
  if (updatedCompleted.has('CI/CD')) confidence += 65;
  if (updatedCompleted.has('Test Coverage')) confidence += 25;
  confidence = Math.min(confidence, 100);

  // Generate value from build area
  let totalValue = 0;
  let bugs = 0;

  updatedMainArea.forEach(() => {
    totalValue += Math.floor(Math.random() * developerPower) + 1;
    const roll = Math.random() * 100;
    if (roll <= updatedTechDebt) {
      bugs++;
    }
  });

  const netValue = totalValue - bugs;

  let delivered = resultHistory.at(-1)?.totalValueDelivered || 0;
  let released = false;

  if (calculateRelease(netValue, confidence)) {
    released = true;
    delivered += netValue;
  }

  const turnSprintData: SprintData = {
    sprintNumber: currentSprint + 1,
    techDebt: updatedTechDebt,
    releaseConfidence: confidence,
    devOutput: totalValue,
    netValue,
    bugs,
    totalValueDelivered: delivered,
    released,
  };

  return {
    updatedTurns,
    updatedCompleted,
    updatedDevelopers,
    updatedMainArea,
    updatedActiveInvestments,
    updatedTechDebt,
    turnSprintData,
    increasePower,
  };
}
