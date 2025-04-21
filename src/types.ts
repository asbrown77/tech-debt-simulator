export type Developer = {
    id: number;
    name: string;
    turnsRemaining?: number;
    output?: number | null; 
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