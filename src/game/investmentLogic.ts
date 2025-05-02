import { InvestmentConfig } from '../config/investmentsConfig';
import { Developer } from '../types';
import { uniqueDevelopers } from '../utils/helpers';

type CompletedInvestmentResult = {
  updatedTechDebt: number;
  updatedReleaseConfidence: number;
  freeInvestedDevelopers: Developer[];
  updatedActiveInvestments: { [investmentName: string]: Developer[] };
  developerPowerIncreased: boolean;
};

export function finalizeCompletedInvestments(
  completedInvestmentNames: string[],
  activeInvestmentsByName: { [investmentName: string]: Developer[] },
  investmentConfigs: InvestmentConfig[],
  currentTechDebt: number,
  currentReleaseConfidence: number,
  currentDevelopers: Developer[]
): CompletedInvestmentResult {
  let updatedTechDebt = currentTechDebt;
  let updatedReleaseConfidence = currentReleaseConfidence;
  let freeInvestedDevelopers: Developer[] = [];
  const updatedActiveInvestments = { ...activeInvestmentsByName };
  let developerPowerIncreased = false;

  completedInvestmentNames.forEach((investmentName) => {
    const investment = investmentConfigs.find((i) => i.name === investmentName);
    if (!investment) {
      throw new Error(`Investment configuration not found for: ${investmentName}`);
    }
    freeInvestedDevelopers = [...freeInvestedDevelopers, ...(activeInvestmentsByName[investmentName] || [])];

    // Reduce tech debt
    const techDebtReduction = investment.techDebtReduction ?? 0;
    updatedTechDebt = Math.max(0, updatedTechDebt - techDebtReduction);

    // Increase release confidence
    const confidenceIncrease = investment.confidenceIncrease ?? 0;
    updatedReleaseConfidence = Math.min(100, updatedReleaseConfidence + confidenceIncrease);

    debugger;
    // Add developers back to the pool
    //freeDevelopers = uniqueDevelopers([...freeDevelopers, ...investedDevelopers]);

    // Clear the investment from active investments
    updatedActiveInvestments[investmentName] = [];

    // Check if developer power increases
    if (investment.increaseValue) {
      developerPowerIncreased = true;
    }
  });

  return {
    updatedTechDebt,
    updatedReleaseConfidence,
    freeInvestedDevelopers,
    updatedActiveInvestments,
    developerPowerIncreased,
  };
}
