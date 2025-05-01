import { Developer, ActiveInvestments, CompletedInvestmentResult} from '../types';
import { InvestmentConfig } from '../config/investmentsConfig';
import { processInvestments } from './trackInvestments';
import { finalizeCompletedInvestments } from './investmentLogic';
import { resetDevelopers, calculateDeveloperOutput } from './developerLogic';
import { calculateReleaseConfidence as getReleaseConfidence, rollForRelease } from './releaseLogic';
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
  developerPower: number,
  getReleased: () => boolean
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

  debugger
  const { updatedDevelopers: finalDevelopers, devValue: devValue, bugs } = calculateDeveloperOutput(
    updatedMainArea,
    developerPower,
    updatedTechDebt
  );

  let previousSprintData = resultHistory.at(-1) ;

  const turnSprintData = generateSprintData(
    currentSprint,
    updatedTechDebt,
    getReleaseConfidence(updatedCompleted, investmentConfigs),
    devValue,
    bugs,
    getReleased(),
    previousSprintData,
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