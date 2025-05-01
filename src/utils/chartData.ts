import { SprintData } from '../types';

export function generateChartData(history: SprintData[], max: number) {
  return Array.from({ length: max }, (_, i) => {
    const sprint = history.find(s => s.sprintNumber === i + 1);
    return {
      sprint: `Sprint ${i + 1}`,
      net: sprint?.netValue ?? null,
      delivered: sprint?.accumulatedValueDelivered ?? null,
      techDebt: sprint?.techDebt ?? null
    };
  });
}

export const normalizeTechDebt = (value: number, maxValue: number): number => {
  if (maxValue === 0) return 0; // Avoid division by zero
  return (value / maxValue) * 100;
};
