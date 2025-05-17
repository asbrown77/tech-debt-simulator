import { IterationData } from '../types';

export function generateIterationData(
  currentIteration: number,
  techDebt: number,
  releaseProbability: number,
  devValue: number,
  bugs: number,
  released: boolean,
  previousIteration?: IterationData
): IterationData {
  
  const netValue = devValue - bugs;
  const accumulatedValueDelivered = previousIteration?.accumulatedValueDelivered || 0;

  return {
    iterationNumber: currentIteration + 1,
    techDebt,
    releaseProbability: releaseProbability,
    devValue,
    bugs,
    netValue,
    released,
    accumulatedValueDelivered,
  };
}
