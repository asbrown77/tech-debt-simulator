export type Developer = {
    id: number;
    name: string;
    value: number;
    turnsRemaining?: number;
  };

  
  export type SprintData = {
    sprintNumber: number;
    techDebt: number;
    releaseConfidence: number;
    devOutput: number;
    netValue: number;
    totalValueDelivered: number;
    bugs: number;
    released: boolean;
  };