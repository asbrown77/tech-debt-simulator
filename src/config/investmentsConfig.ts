

export class BaseInvestment {
  releaseProbabilityIncrease?: number;
  techDebtReduction?: number;
  increaseValue?: boolean;
  description?: string;

   get tooltip(): string[] {
     return formatDescription(this);
   }
}

export type InvestmentConfig = BaseInvestment & {
  name: string;
  maxDevelopers: number;
  turnsToComplete: number;
};

export const investmentConfigs: InvestmentConfig[] = [
  Object.assign(new BaseInvestment(), {
    name: 'Continuous Delivery',
    maxDevelopers: 3,
    turnsToComplete: 2,
    releaseProbabilityIncrease: 60,
    techDebtReduction: 5,
    increaseValue: true,
    description:  "Boost release probability and accelerate feedback loops for faster value delivery"
  }),
  Object.assign(new BaseInvestment(), {
    name: 'Reduce Complexity',
    maxDevelopers: 1,
    turnsToComplete: 2,
    techDebtReduction: 15,
    description:  "Simplify codebase and improve maintainability for long-term success."
  }),
  Object.assign(new BaseInvestment(), {
    name: 'Test Coverage',
    maxDevelopers: 2,
    turnsToComplete: 3,
    releaseProbabilityIncrease: 20,
    techDebtReduction: 15,
    increaseValue: true,
    description:  "Improve system reliability and reduce risks with better test coverage."
  }),
  Object.assign(new BaseInvestment(), {
    name: 'Code Quality',
    maxDevelopers: 2,
    turnsToComplete: 1,
    techDebtReduction: 15,
    increaseValue: true,
    description:  "Enhance code quality and maintainability for long-term success."
  })
];

export const formatDescription = (config: BaseInvestment): string[] => {
  const parts: string[] = [];
  if (config.releaseProbabilityIncrease)
    parts.push(`+${config.releaseProbabilityIncrease}% release propability`);
  if (config.techDebtReduction)
    parts.push(`-${config.techDebtReduction} tech debt`);
  if (config.increaseValue)
    parts.push('+1 Max value');
  return parts; // Return an array of strings
};
