import React from 'react';
import styles from '../styles/Developer.module.css';
import DeveloperToken from '../developer-token.png';
import { Developer } from '../types';

export type DeveloperWithValueProps = {
  developer: Developer;
  onDragStart: (e: React.DragEvent, m: Developer) => void;
  developerPower: number;
  isInvestment?: boolean;
};

export const DeveloperWithValue = ({
  developer,
  onDragStart,
  developerPower,
  isInvestment,
}: DeveloperWithValueProps) => {
  const showOutput = !isInvestment && developer.output !== undefined && developer.output !== null;
  const showBug = !isInvestment && developer.hasBug;

  return (
    <div className={styles.outerWrapper}>
      <div className={styles.devCard}>
        
        {/* Top Row: Output */}
        <div className={styles.outputRow}>
          {showOutput ? `+${developer.output}` : ''}
        </div>

        {/* Middle Row: Developer Icon */}
        <div className={styles.devIconRow}>
          <img
            src={DeveloperToken}
            draggable
            onDragStart={(e) => onDragStart(e, developer)}
            onDragEnd={(e) => {
              if (e.currentTarget instanceof HTMLElement) {
                e.currentTarget.style.opacity = '1';
              }
            }}
            className={`${styles.image} ${developer.working ? styles.imageWorking : ''} ${isInvestment ? styles.imageInvestment : ''}`}
            alt={`Developer ${developer.id}`}
          />
        </div>

        {/* Bottom Row: Bug */}
        <div className={styles.bugRow}>
          {showBug && <span className={styles.bugTag}>🐞</span>}
        </div>

      </div>
    </div>
  );
};

export const DeveloperPlaceholder = () => (
  <div className={styles.placeholder} />
);
