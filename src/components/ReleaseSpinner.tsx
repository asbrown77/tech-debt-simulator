import React from 'react';

type ReleaseSpinnerProps = {
  roll: number;
  confidence: number;
};

export const ReleaseSpinner = ({ roll, confidence }: ReleaseSpinnerProps) => {
  const sectorCount = 10;
  const successSectors = Math.round((confidence / 100) * sectorCount);

  const sectors = Array.from({ length: sectorCount }, (_, i) => ({
    success: i < successSectors,
  }));

  const rolledSector = Math.floor((roll / 100) * sectorCount);

  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${sectorCount}, 1fr)`,
          gap: '2px',
          marginBottom: '0.5rem'
        }}
      >
        {sectors.map((sector, idx) => (
          <div
            key={idx}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: sector.success ? '#4caf50' : '#f44336',
              border: idx === rolledSector ? '2px solid black' : '1px solid #ccc',
              borderRadius: '3px'
            }}
          />
        ))}
      </div>
      <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
        Roll 🎲 {roll} / Confidence {confidence}%
      </div>
    </div>
  );
};
