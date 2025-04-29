import { Developer } from '../types';
import { InvestmentConfig } from '../config/investments';
import { processInvestments } from './trackInvestments';
import { processCompletedInvestments } from './investments';
import { resetDevelopers, calculateDeveloperOutput } from './developers';
import { calculateReleaseConfidence, rollForRelease } from './release';
import { generateSprintData } from './sprint';
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

  let updatedDevelopers = resetDevelopers(developers);
  let updatedMainArea = resetDevelopers(mainArea);

  const {
    updatedTechDebt,
    updatedDevelopers: processedDevelopers,
    updatedActiveInvestments,
    increasePower,
  } = processCompletedInvestments(
    Array.from(newlyCompleted),
    activeInvestments,
    investmentConfigs,
    techDebt,
    updatedDevelopers
  );

  const confidence = calculateReleaseConfidence(updatedCompleted, investmentConfigs);

  const { updatedDevelopers: finalDevelopers, totalValue, bugs } = calculateDeveloperOutput(
    updatedMainArea,
    developerPower,
    updatedTechDebt
  );

  const netValue = totalValue - bugs;
  let delivered = resultHistory.at(-1)?.totalValueDelivered || 0;

  const released = rollForRelease(confidence);
  if (released) {
    delivered += netValue;
  }

  const turnSprintData = generateSprintData(
    currentSprint,
    updatedTechDebt,
    confidence,
    totalValue,
    netValue,
    bugs,
    delivered,
    released,
    Math.floor(Math.random() * 100) + 1
  );

  return {
    updatedTurns,
    updatedCompleted,
    updatedDevelopers: processedDevelopers,
    updatedMainArea: finalDevelopers,
    updatedActiveInvestments,
    updatedTechDebt,
    turnSprintData,
    increasePower,
  };
}