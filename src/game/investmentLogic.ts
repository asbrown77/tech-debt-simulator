import { InvestmentConfig } from '../config/investmentsConfig';
import { Developer } from '../types';

type CompletedInvestmentResult = {
  updatedTechDebt: number;
  updatedReleaseProbability: number;
  freeInvestedDevelopers: Developer[];
  updatedActiveInvestments: { [investmentName: string]: Developer[] };
  developerPowerIncreased: boolean;
};

export function finalizeCompletedInvestments(
  completedInvestmentNames: string[],
  activeInvestmentsByName: { [investmentName: string]: Developer[] },
  investmentConfigs: InvestmentConfig[],
  currentTechDebt: number,
  currentReleaseProbability: number
): CompletedInvestmentResult {
  let updatedTechDebt = currentTechDebt;
  let updatedReleaseProbability = currentReleaseProbability;
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

    // Increase release probability
    const probabilityIncrease = investment.releaseProbabilityIncrease ?? 0;
    updatedReleaseProbability = Math.min(100, updatedReleaseProbability + probabilityIncrease);

    // Clear the investment from active investments
    updatedActiveInvestments[investmentName] = [];

    // Check if developer power increases
    if (investment.increaseValue) {
      developerPowerIncreased = true;
    }
  });

  return {
    updatedTechDebt,
    updatedReleaseProbability: updatedReleaseProbability,
    freeInvestedDevelopers,
    updatedActiveInvestments,
    developerPowerIncreased,
  };
}
