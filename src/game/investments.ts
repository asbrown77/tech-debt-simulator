import { InvestmentConfig } from '../config/investments';
import { Developer } from '../types';
import { uniqueDevelopers } from '../utils/helpers';

export function processCompletedInvestments(
  newlyCompleted: string[],
  activeInvestments: { [key: string]: Developer[] },
  investmentConfigs: InvestmentConfig[],
  techDebt: number,
  developers: Developer[]
) {
  let updatedTechDebt = techDebt;
  let updatedDevelopers = [...developers];
  const updatedActiveInvestments = { ...activeInvestments };
  let increasePower = false;

  newlyCompleted.forEach((name) => {
    const investment = investmentConfigs.find((i) => i.name === name)!;
    const completedDevelopers = activeInvestments[name];

    const currentUnits = Math.ceil((updatedTechDebt * 100) / 100); // BASE_TECH_DEBT assumed as 100
    const newUnits = Math.max(0, currentUnits - (investment.techDebtReduction ?? 0));
    updatedTechDebt = (newUnits * 100) / 100;

    updatedDevelopers = uniqueDevelopers([...updatedDevelopers, ...completedDevelopers]);
    updatedActiveInvestments[name] = [];

    if (investment.increaseValue) {
      increasePower = true;
    }
  });

  return { updatedTechDebt, updatedDevelopers, updatedActiveInvestments, increasePower };
}
