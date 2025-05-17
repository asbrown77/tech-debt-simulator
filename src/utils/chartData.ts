import { IterationData } from '../types';

export function generateChartData(history: IterationData[], max: number) {
  return Array.from({ length: max }, (_, i) => {
    const iteration = history.find(s => s.iterationNumber === i + 1);
    return {
      iteration: `Iteration ${i + 1}`,
      net: iteration?.netValue ?? null,
      delivered: iteration?.accumulatedValueDelivered ?? null,
      techDebt: iteration?.techDebt ?? null
    };
  });
}

export const normalizeTechDebt = (value: number, maxValue: number): number => {
  if (maxValue === 0) return 0; // Avoid division by zero
  return (value / maxValue) * 100;
};
