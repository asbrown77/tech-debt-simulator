import React from 'react';
import styles from '../styles/Developer.module.css';
import DeveloperToken from '../developer-token.png';
import { Developer } from '../types';

export type DeveloperComponentProps = {
  developer: Developer;
  onDragStart: (e: React.DragEvent, m: Developer) => void;
  developerPower: number;
  isInvestment: boolean;
  disabled?: boolean;
  devInfo?: boolean;
};

export const DeveloperComponent = ({
  developer,
  onDragStart,
  developerPower,
  isInvestment,
  devInfo = true,
  disabled,

}: DeveloperComponentProps & { devInfo?: boolean }) => {
  const showOutput = devInfo && !isInvestment && developer.output !== undefined && developer.output !== null;
  const showBug = devInfo && !isInvestment && developer.hasBug;


  return (
    <div
      className={`${styles.outerWrapper} ${disabled ? styles.disabled : ''}`}
      draggable={!disabled}
      onDragStart={(e) => {
        if (!disabled) {
          onDragStart(e, developer);
        }
      }}
    >
      <div className={styles.devCard}>
        
        {/* Top Row: Output */}
        <div className={styles.outputRow}>
          {showOutput ? `+${developer.output}` : ''}
        </div>

        {/* Middle Row: Developer Icon */}
        <div className={styles.devIconRow}>
          <img
            src={DeveloperToken}
            className={`${styles.image} ${developer.working ? styles.imageWorking : ''} ${
              isInvestment ? styles.imageInvestment : ''
            } ${disabled ? styles.imageDisabled : ''}`} // Apply disabled class
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
