import { Developer, ActiveInvestments} from '../types';
import { InvestmentConfig } from '../config/investmentsConfig';
import { processInvestments } from './trackInvestments';
import { finalizeCompletedInvestments } from './investmentLogic';
import { resetDevelopers, calculateDeveloperOutput } from './developerLogic';
import { calculateReleaseConfidence as getReleaseConfidence } from './releaseLogic';
import { generateSprintData } from './sprintLogic';
import { SprintData } from '../types';

export function handleBeginTurnLogic(
  activeInvestments: ActiveInvestments,
  investmentConfigs: InvestmentConfig[],
  turnsRemaining: { [key: string]: number | undefined },
  completedInvestments: Set<string>,
  mainArea: Developer[],
  resultHistory: SprintData[],
  currentSprint: number,
  techDebt: number,
  releaseConfidence: number,
  developerPower: number,
  getReleased: () => boolean
) {
  const { updatedTurns, updatedCompleted, newlyCompleted } = processInvestments(
    activeInvestments,
    turnsRemaining,
    completedInvestments,
    investmentConfigs
  );

  let updatedMainArea = resetDevelopers(mainArea);

  const {
    updatedTechDebt,
    freeInvestedDevelopers,
    updatedActiveInvestments,
    developerPowerIncreased,
  } = finalizeCompletedInvestments(
    Array.from(newlyCompleted),
    activeInvestments,
    investmentConfigs,
    techDebt,
    releaseConfidence
  );

  console.log('Updated Tech Debt:', updatedTechDebt);
  console.log('Free Invested Developers:', freeInvestedDevelopers);
  console.log('Updated Active Investments:', updatedActiveInvestments);
 
  const { updatedDevelopers: workingDevelopers, devValue: devValue, bugs } = calculateDeveloperOutput(
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
    freeInvestedDevelopers,
    workingDevelopers,
    updatedActiveInvestments,
    updatedTechDebt,
    turnSprintData,
    developerPowerIncreased,
  };
}