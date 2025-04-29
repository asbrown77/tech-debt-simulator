import { InvestmentConfig } from '../config/investmentsConfig';
import { Developer } from '../types';
import { uniqueDevelopers } from '../utils/helpers';

type CompletedInvestmentResult = {
  updatedTechDebt: number;
  updatedDevelopers: Developer[];
  updatedActiveInvestments: { [investmentName: string]: Developer[] };
  developerPowerIncreased: boolean;
};

export function finalizeCompletedInvestments(
  completedInvestmentNames: string[],
  activeInvestmentsByName: { [investmentName: string]: Developer[] },
  investmentConfigs: InvestmentConfig[],
  currentTechDebt: number,
  currentDevelopers: Developer[]
): CompletedInvestmentResult {
  let updatedTechDebt = currentTechDebt;
  let updatedDevelopers = [...currentDevelopers];
  const updatedActiveInvestments = { ...activeInvestmentsByName };
  let developerPowerIncreased = false;

  completedInvestmentNames.forEach((investmentName) => {
    const investment = investmentConfigs.find((i) => i.name === investmentName);
    if (!investment) {
      throw new Error(`Investment configuration not found for: ${investmentName}`);
    }

    const developersAssigned = activeInvestmentsByName[investmentName] || [];

    // Reduce tech debt
    const techDebtReduction = investment.techDebtReduction ?? 0;
    updatedTechDebt = Math.max(0, updatedTechDebt - techDebtReduction);

    // Add developers back to the pool
    updatedDevelopers = uniqueDevelopers([...updatedDevelopers, ...developersAssigned]);

    // Clear the investment from active investments
    updatedActiveInvestments[investmentName] = [];

    // Check if developer power increases
    if (investment.increaseValue) {
      developerPowerIncreased = true;
    }
  });

  return {
    updatedTechDebt,
    updatedDevelopers,
    updatedActiveInvestments,
    developerPowerIncreased,
  };
}
