import React from 'react';
import styles from '../styles/TechDebtBadge.module.css';
import { getTechDebtLetter, getTechDebtColor } from '../utils/helpers';

type TechDebtBadgeProps = {
  value: number; // Numeric tech debt value
  maxValue: number; // Maximum tech debt value for scaling
};

export const TechDebtBadge: React.FC<TechDebtBadgeProps> = ({ value, maxValue }) => {
  const letter = getTechDebtLetter(value, maxValue);
  const color = getTechDebtColor(value, maxValue);

  return (
    <div
      className={styles.badge}
      style={{
        backgroundColor: color,
        color: '#fff', // White font color
      }}
    >
      {letter}
    </div>
  );
};