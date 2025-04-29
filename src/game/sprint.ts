import { SprintData } from '../types';

export function generateSprintData(
  currentSprint: number,
  techDebt: number,
  confidence: number,
  totalValue: number,
  netValue: number,
  bugs: number,
  delivered: number,
  released: boolean,
  roll: number
): SprintData {
  return {
    sprintNumber: currentSprint + 1,
    techDebt,
    releaseConfidence: confidence,
    devOutput: totalValue,
    netValue,
    bugs,
    totalValueDelivered: delivered,
    released,
    roll,
  };
}
