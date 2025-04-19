import React from 'react';

export type GameStatsProps = {
  techDebt: number;
  releaseConfidence: number;
  cumulativeValue: number;
  bugs: number;
};

export const GameStats = ({
  techDebt,
  releaseConfidence,
  cumulativeValue,
  bugs
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
    <div><strong>Value:</strong> {cumulativeValue}</div>
    <div><strong>Bugs:</strong> {bugs}</div>
  </div>
);
