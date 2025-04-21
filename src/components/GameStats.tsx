import React from 'react';

export type GameStatsProps = {
  techDebt: number;
  releaseConfidence: number;
  cumulativeValue: number;
  bugs: number;
};

export const GameStats = ({
  techDebt,
  releaseConfidence
}: GameStatsProps) => (
  <div
    style={{
      backgroundColor: '#f8f9fa',
      padding: '1rem',
      borderRadius: 8,
      border: '1px solid #dee2e6',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.5rem',
      marginBottom: '1rem'
    }}
  >
    <div><strong>Tech Debt:</strong> {techDebt}%</div>
    <div><strong>Release Confidence:</strong> {releaseConfidence}%</div>
  </div>
);


export type TurnValuesProps = {
  value: number;
  bugs: number;
  netValue: number;
  successfulRelease: boolean;
};

export const TurnValues = ({
  value,
  bugs,
  netValue,
  successfulRelease
}: TurnValuesProps) => (
  <div
    style={{
      backgroundColor: '#f8f9fa',
      padding: '1rem',
      borderRadius: 8,
      border: '1px solid #dee2e6',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gap: '0.5 rem',
      marginBottom: '1rem'
    }}
  >
    <div><strong>Value:</strong> {value}</div>
    <div><strong>Bugs:</strong> {bugs}</div>
    <div><strong>Net Output:</strong> {netValue}</div>
    <div><strong>Release Successful:</strong> {successfulRelease ? 'Yes' : 'No'}</div>
  </div>
);

