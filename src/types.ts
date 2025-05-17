import { ReactNode } from 'react';

export type GameSession = {
  name: string;
  timestamp: number;
  resultHistory: IterationData[];
};

export type Developer = {
    id: number;
    name: string;
    turnsRemaining?: number;
    output?: number | null; 
    hasBug?: boolean | null;
    working?: boolean | null;
  };

export type IterationData = {
  iterationNumber: number;
  techDebt: number;
  releaseProbability: number;
  devValue: number;
  bugs: number;
  netValue: number;
  released: boolean; 
  accumulatedValueDelivered: number;
};

export type ActiveInvestments = { [investmentName: string]: Developer[] };

export type CompletedInvestmentResult = {
  updatedTechDebt: number;
  updatedDevelopers: Developer[];
  updatedActiveInvestments: ActiveInvestments;
  developerPowerIncreased: boolean;
};

export type ModalContent = {
  buttonText?: string;
  body: ReactNode;
};