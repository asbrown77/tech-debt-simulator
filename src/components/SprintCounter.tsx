import React from 'react';

type SprintCounterProps = {
  currentSprint: number;
  maxSprints: number;
};

export const SprintCounter: React.FC<SprintCounterProps> = ({ currentSprint, maxSprints }) => (
  <div style={{ 
    textAlign: 'center', 
    fontSize: '1.5rem', 
    marginBottom: '1rem',
    fontWeight: 'bold',
    color: '#333'
  }}>
    Sprint {currentSprint} of {maxSprints}
  </div>
);
