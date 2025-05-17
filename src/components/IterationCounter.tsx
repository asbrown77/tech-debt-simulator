import React from 'react';
import styles from '../styles/GameStats.module.css';

type IterationCounterProps = {
  currentIteration: number;
  maxIterations: number;
};

export const IterationCounter: React.FC<IterationCounterProps> = ({ currentIteration, maxIterations }) => (
  <div className={styles.turnSummary}>
  <div style={{ 
    textAlign: 'center', 
    fontSize: '1.4rem', 
    marginBottom: '0rem',
    fontWeight: 'bold',
    color: 'white'
  }}>
    Iteration {currentIteration} of {maxIterations}
  </div>
  </div>
);
