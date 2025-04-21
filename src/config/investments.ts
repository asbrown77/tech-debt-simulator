export const BASE_TECH_DEBT = 5;

export class BaseInvestment {
  confidenceIncrease?: number;
  techDebtReduction?: number;
  increaseValue?: boolean;

  get description(): string {
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
    name: 'CI/CD',
    maxDevelopers: 3,
    turnsToComplete: 2,
    confidenceIncrease: 65,
    techDebtReduction: 1,
    increaseValue: true
  }),
  Object.assign(new BaseInvestment(), {
    name: 'Test Coverage',
    maxDevelopers: 2,
    turnsToComplete: 2,
    confidenceIncrease: 25,
    increaseValue: true
  }),
  Object.assign(new BaseInvestment(), {
    name: 'Code Quality',
    maxDevelopers: 2,
    turnsToComplete: 1,
    techDebtReduction: 1,
    increaseValue: true
  }),
  Object.assign(new BaseInvestment(), {
    name: 'Reduce Complexity',
    maxDevelopers: 1,
    turnsToComplete: 2,
    techDebtReduction: 3
  })
];

export const formatDescription = (config: BaseInvestment): string => {
  const parts = [];
  if (config.confidenceIncrease)
    parts.push(`+${config.confidenceIncrease}% confidence`);
  if (config.techDebtReduction)
    parts.push(`-${config.techDebtReduction} tech debt`);
  if (config.increaseValue)
    parts.push('+1 value');
  return parts.join(', ');
};
