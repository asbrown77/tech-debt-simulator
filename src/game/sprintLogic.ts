import { SprintData } from '../types';

export function generateSprintData(
  currentSprint: number,
  techDebt: number,
  releaseConfidence: number,
  devValue: number,
  bugs: number,
  released: boolean,
  previousSprint?: SprintData
): SprintData {
  
  const netValue = devValue - bugs;
  const accumulatedValueDelivered = previousSprint?.accumulatedValueDelivered || 0;

  return {
    sprintNumber: currentSprint + 1,
    techDebt,
    releaseConfidence,
    devValue,
    bugs,
    netValue,
    released,
    accumulatedValueDelivered,
  };
}
