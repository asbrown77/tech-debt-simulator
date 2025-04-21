import { SprintData } from '../types';

export function generateChartData(history: SprintData[], max: number) {
  return Array.from({ length: max }, (_, i) => {
    const sprint = history.find(s => s.sprintNumber === i + 1);
    return {
      sprint: `Sprint ${i + 1}`,
      net: sprint?.netValue ?? null,
      delivered: sprint?.totalValueDelivered ?? null,
      techDebt: sprint?.techDebt ?? null
    };
  });
}
