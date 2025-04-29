export type Developer = {
    id: number;
    name: string;
    turnsRemaining?: number;
    output?: number | null; 
    hasBug?: boolean | null;
    working?: boolean | null;
  };

  
  export type SprintData = {
    sprintNumber: number;
    techDebt: number;
    releaseConfidence: number;
    roll: number;               // Roll happens after setting confidence
    released: boolean;          // Result of the roll
    devOutput: number;
    bugs: number;
    netValue: number;
    totalValueDelivered: number;
};

export type ActiveInvestments = { [investmentName: string]: Developer[] };

export type CompletedInvestmentResult = {
  updatedTechDebt: number;
  updatedDevelopers: Developer[];
  updatedActiveInvestments: ActiveInvestments;
  developerPowerIncreased: boolean;
};