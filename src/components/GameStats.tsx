import React from 'react';
import styles from '../styles/GameStats.module.css';

export type GameStatsProps = {
  techDebt: number;
  releaseConfidence: number;
  developerValue: number;
};

export const GameStats = ({
  techDebt,
  releaseConfidence,
  developerValue
}: GameStatsProps) => (
  <div className={styles.tableContainer}>
    <div className={styles.row}>
      <div className={styles.cell}>Tech Debt</div>
      <div className={styles.cell}>Release Confidence</div>
      <div className={styles.cell}>Dev Output</div>
    </div>
    <div className={styles.row}>
      <div className={styles.cell}>{techDebt}%</div>
      <div className={styles.cell}>{releaseConfidence}%</div>
      <div className={styles.cell}>1 to {developerValue}</div>
    </div>
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
  <div className={styles.turnValues} 
  >
 <div>
      <span className={styles.label}>Dev Output:</span>
      <span className={styles.value}>{value}</span>
    </div>
    <div>
      <span className={styles.label}>Number of Bugs:</span>
      <span className={styles.value}>{bugs}</span>
    </div>
    <div>
      <span className={styles.label}>Net Output:</span>
      <span className={styles.value}>{netValue}</span>
    </div>
    <div>
      <span className={styles.label}>Release Successful:</span>
      <span className={styles.value}>{successfulRelease ? 'Yes' : 'No'}</span>
    </div>
  </div>
);

