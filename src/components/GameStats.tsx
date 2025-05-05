import React from 'react';
import styles from '../styles/GameStats.module.css';
import { TechDebtBadge } from './TechDebtBadge';
import DeveloperOutput from '../developer-output2.png';

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
  prevDevPower,
}: GameStatsProps) => (
  <div className={styles.teamValues}>
    <div className={styles.statBlock}>
      <span className={styles.label}>Tech Debt</span>
      <span className={`${styles.value} ${techDebt < prevTechDebt ? styles.improved : ''}`}>
        <TechDebtBadge value={techDebt} maxValue={50} />
      </span>
    </div>
    <div className={`${styles.statBlock} ${styles.releaseConfidenceBlock}`}>
      <span className={styles.label}>Release Confidence</span>
      <span className={`${styles.value} ${releaseConfidence > prevConfidence ? styles.improved : ''}`}>
        {releaseConfidence}%
      </span>
    </div>
    <div className={styles.statBlock}>
      <img src={DeveloperOutput} className={styles.image} alt="Developer Output" />
      <span className={`${styles.value} ${developerValue > prevDevPower ? styles.improved : ''}`}>
        <strong>1 to {developerValue}</strong>
      </span>
    </div>
  </div>
);
