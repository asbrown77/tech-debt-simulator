export function calculateReleaseProbability(
  completedInvestments: Set<string>,
  investmentConfigs: { name: string; probabilityIncrease?: number }[]
) {
  let releaseProbability = 20;
  if (completedInvestments.has('Continuous Delivery')) {
    releaseProbability += investmentConfigs.find((i) => i.name === 'Continuous Delivery')?.probabilityIncrease ?? 0;
  }
  if (completedInvestments.has('Test Coverage')) {
    releaseProbability += investmentConfigs.find((i) => i.name === 'Test Coverage')?.probabilityIncrease ?? 0;
  }
  return Math.min(releaseProbability, 100);
}

export function rollForRelease(probability: number) {
  const roll = Math.floor(Math.random() * 100) + 1;
  return roll <= probability;
}
