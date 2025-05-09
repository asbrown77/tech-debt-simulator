import React from 'react';
import styles from '../styles/GameStats.module.css';

type SprintCounterProps = {
  currentSprint: number;
  maxSprints: number;
};

export const SprintCounter: React.FC<SprintCounterProps> = ({ currentSprint, maxSprints }) => (
  <div className={styles.turnSummary}>
  <div style={{ 
    textAlign: 'center', 
    fontSize: '1.4rem', 
    marginBottom: '0rem',
    fontWeight: 'bold',
    color: 'white'
  }}>
    Iteration {currentSprint} of {maxSprints}
  </div>
  </div>
);
