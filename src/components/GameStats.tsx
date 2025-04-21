import React from 'react';
import styles from '../styles/GameStats.module.css';

export type GameStatsProps = {
  techDebt: number;
  releaseConfidence: number;
  developerValue: number;
  prevTechDebt: number;
  prevConfidence: number;
  prevDevPower: number;
};

export const GameStats = ({
  techDebt,
  releaseConfidence,
  developerValue,
  prevTechDebt,
  prevConfidence,
  prevDevPower
}: GameStatsProps) => (
  <div className={styles.teamValues}>
    <div>
      <span className={styles.label}>Tech Debt</span>
      <span className={`${styles.value} ${techDebt < prevTechDebt ? styles.improved : ''}`}>
        {techDebt}%
      </span>
    </div>
    <div>
      <span className={styles.label}>Confidence</span>
      <span className={`${styles.value} ${releaseConfidence > prevConfidence ? styles.improved : ''}`}>
        {releaseConfidence}%
      </span>
    </div>
    <div>
      <span className={styles.label}>Dev Output</span>
      <span className={`${styles.value} ${developerValue > prevDevPower ? styles.improved : ''}`}>
        1 to {developerValue}
      </span>
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

