import React from 'react';
import styles from '../styles/Developer.module.css';
import developerIcon from '../developer.svg';
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
}: DeveloperWithValueProps) => (
  <div className={styles.wrapper}>
    <img
      src={developerIcon}
      draggable
      onDragStart={(e) => onDragStart(e, developer)}
      onDragEnd={(e) => {
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.style.opacity = '1';
        }
      }}
      className={`${styles.image} ${isInvestment ? styles.imageInvestment : ''}`}
      alt={`Developer ${developer.id}`}
    />
    <div className={styles.valueTag}>{developerPower}</div>

    {isInvestment && developer.turnsRemaining !== undefined && (
      <div
        className={`${styles.turnTag} ${
          developer.turnsRemaining === 0 ? styles.turnDone : ''
        }`}
      >
        {developer.turnsRemaining}
      </div>
    )}
  </div>
);

export const DeveloperPlaceholder = () => (
  <div className={styles.placeholder} />
);
