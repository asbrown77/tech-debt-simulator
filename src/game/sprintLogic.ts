import { SprintData } from '../types';

export function generateSprintData(
  currentSprint: number,
  techDebt: number,
  releaseConfidence: number,
  devValue: number,
  bugs: number,
  netValue: number,
  released: boolean,
  valueDelivered: number,
  accumulatedValueDelivered: number,
): SprintData {
  return {
    sprintNumber: currentSprint + 1,
    techDebt,
    releaseConfidence,
    devValue,
    bugs,
    netValue,
    released,
    valueDelivered,
    accumulatedValueDelivered,
  };
}
