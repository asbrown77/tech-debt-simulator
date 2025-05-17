import { Developer, ActiveInvestments} from '../types';
import { InvestmentConfig } from '../config/investmentsConfig';
import { processInvestments } from './trackInvestments';
import { finalizeCompletedInvestments } from './investmentLogic';
import { resetDevelopers, calculateDeveloperOutput } from './developerLogic';
import { calculateReleaseProbability as getReleaseProbability } from './releaseLogic';
import { generateIterationData } from './iterationLogic';
import { IterationData } from '../types';

function summarizeDeveloperOutput(devs: Developer[]) {
  let devValue = 0;
  let bugs = 0;

  for (const dev of devs) {
    if (dev.output != null) devValue += dev.output;
    if (dev.hasBug) bugs++;
  }

  return { devValue, bugs };
}

export function handleBeginTurnLogic(
  activeInvestments: ActiveInvestments,
  investmentConfigs: InvestmentConfig[],
  turnsRemaining: { [key: string]: number | undefined },
  completedInvestments: Set<string>,
  mainArea: Developer[],
  resultHistory: IterationData[],
  currentIteration: number,
  techDebt: number,
  releaseProbability: number,
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
    releaseProbability
  );

  console.log('Updated Tech Debt:', updatedTechDebt);
  console.log('Free Invested Developers:', freeInvestedDevelopers);
  console.log('Updated Active Investments:', updatedActiveInvestments);
 
  const { devValue, bugs } = summarizeDeveloperOutput(mainArea);

  let previousIterationData = resultHistory.at(-1) ;

  const turnIterationData = generateIterationData(
    currentIteration,
    updatedTechDebt,
    getReleaseProbability(updatedCompleted, investmentConfigs),
    devValue,
    bugs,
    getReleased(),
    previousIterationData,
  );


  return {
    updatedTurns,
    updatedCompleted,
    freeInvestedDevelopers,
    updatedActiveInvestments,
    updatedTechDebt,
    turnIterationData,
    developerPowerIncreased,
  };
}