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
    devValue: number;
    bugs: number;
    netValue: number;
    released: boolean; 
    valueDelivered: number;        
    accumulatedValueDelivered: number;
    roll: number; 
};

export type ActiveInvestments = { [investmentName: string]: Developer[] };

export type CompletedInvestmentResult = {
  updatedTechDebt: number;
  updatedDevelopers: Developer[];
  updatedActiveInvestments: ActiveInvestments;
  developerPowerIncreased: boolean;
};