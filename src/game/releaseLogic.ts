export function calculateReleaseConfidence(
  completedInvestments: Set<string>,
  investmentConfigs: { name: string; confidenceIncrease?: number }[]
) {
  let confidence = 20;
  if (completedInvestments.has('CI/CD')) {
    confidence += investmentConfigs.find((i) => i.name === 'CI/CD')?.confidenceIncrease ?? 0;
  }
  if (completedInvestments.has('Test Coverage')) {
    confidence += investmentConfigs.find((i) => i.name === 'Test Coverage')?.confidenceIncrease ?? 0;
  }
  return Math.min(confidence, 100);
}

export function rollForRelease(confidence: number) {
  const roll = Math.floor(Math.random() * 100) + 1;
  return roll <= confidence;
}
