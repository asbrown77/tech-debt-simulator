import { Developer, ActiveInvestments, CompletedInvestmentResult} from '../types';
import { InvestmentConfig } from '../config/investmentsConfig';
import { processInvestments } from './trackInvestments';
import { finalizeCompletedInvestments } from './investmentLogic';
import { resetDevelopers, calculateDeveloperOutput } from './developerLogic';
import { calculateReleaseConfidence, rollForRelease } from './releaseLogic';
import { generateSprintData } from './sprintLogic';
import { SprintData } from '../types';

export function handleBeginTurnLogic(
  activeInvestments: ActiveInvestments,
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
    developerPowerIncreased,
  } = finalizeCompletedInvestments(
    Array.from(newlyCompleted),
    activeInvestments,
    investmentConfigs,
    techDebt,
    updatedDevelopers
  );

  const confidence = calculateReleaseConfidence(updatedCompleted, investmentConfigs);

  const { updatedDevelopers: finalDevelopers, devValue: devValue, bugs } = calculateDeveloperOutput(
    updatedMainArea,
    developerPower,
    updatedTechDebt
  );

  const netValue = devValue - bugs;
  let accumulatedValueDelivered = resultHistory.at(-1)?.accumulatedValueDelivered || 0;

  const released = rollForRelease(confidence);
  if (released) {
    accumulatedValueDelivered += netValue;
  }

  const turnSprintData = generateSprintData(
    currentSprint,
    updatedTechDebt,
    confidence,
    devValue,
    netValue,
    bugs,
    released,
    netValue,
    accumulatedValueDelivered,
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
    developerPowerIncreased,
  };
}