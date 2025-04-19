import React from 'react';
import { Meeple } from '../types';
import { MeepleWithValue } from './Meeple';

type DropZoneProps = {
  title: string;
  area: Meeple[];
  setArea: (updater: (prev: Meeple[]) => Meeple[]) => void;
  color: string;
  description?: string;
  isBuildArea?: boolean;
  maxMeeples?: number;
  turnsToComplete?: number;
  turnsRemaining: { [key: string]: number | undefined };
  handleDrop: (event: React.DragEvent, targetArea: string, areaSetter: (updater: (prev: Meeple[]) => Meeple[]) => void) => void;
  handleDragStart: (event: React.DragEvent, meeple: Meeple, sourceArea?: string) => void;
  completedInvestments: Set<string>;
  investmentConfigs: { name: string; maxMeeples: number; turnsToComplete: number }[];
};

const DropZone: React.FC<DropZoneProps> = ({
  title,
  area,
  setArea,
  color,
  description,
  isBuildArea,
  maxMeeples,
  turnsToComplete,
  turnsRemaining,
  handleDrop,
  handleDragStart,
  completedInvestments,
  investmentConfigs
}) => {
  const investmentConfig = investmentConfigs.find(config => config.name === title);
  const isCompleted = !isBuildArea && completedInvestments.has(title);

  const allowDrop = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const MeeplePlaceholder = () => (
    <div style={{
      width: 50,
      height: 50,
      border: '2px dashed #666',
      borderRadius: '50%',
      opacity: 0.5,
      margin: '0.5rem'
    }} />
  );

  return (
    <div
      onDrop={(e) => !isCompleted && handleDrop(e, title, setArea)}
      onDragOver={allowDrop}
      style={{
        flex: 1,
        minHeight: 150,
        backgroundColor: isCompleted ? '#e0e0e0' : color,
        padding: '1rem',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        opacity: isCompleted ? 0.6 : 1,
        transition: 'opacity 0.3s ease'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: '0.5rem'
      }}>
        <strong style={{ textAlign: 'center' }}>{title}</strong>
        {!isBuildArea && investmentConfig && (isCompleted || area.length === maxMeeples) && (
          <div style={{
            backgroundColor: isCompleted ? 'rgba(40, 167, 69, 0.9)' : 'rgba(30, 119, 235, 0.7)',
            color: 'white',
            fontSize: '14px',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>
            {isCompleted ? '0 turns' : `${turnsRemaining[title] ?? investmentConfig.turnsToComplete} turns`}
          </div>
        )}
      </div>

      {turnsToComplete && (
        <div style={{
          textAlign: 'center',
          fontSize: '0.8rem',
          color: '#666',
          marginBottom: '0.5rem'
        }}>
          Turns to complete: {turnsToComplete}
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: isBuildArea ? '200px' : '60px',
        flex: 1,
        alignContent: 'center'
      }}>
        {!isBuildArea && maxMeeples && Array(maxMeeples).fill(null).map((_, index) => (
          <div key={`placeholder-${title}-${index}`} style={{ position: 'relative' }}>
            {area[index] ? (
              <MeepleWithValue
                key={`${title}-${area[index].id}`}
                meeple={area[index]}
                onDragStart={(e, m) => {
                  if (e.currentTarget instanceof HTMLElement) {
                    e.currentTarget.style.opacity = '0.5';
                  }
                  handleDragStart(e, m, title);
                }}
                isInvestment={true}
              />
            ) : (
              <MeeplePlaceholder />
            )}
          </div>
        ))}
        {isBuildArea && area.map((m) => (
          <MeepleWithValue
            key={`Build-${m.id}`}
            meeple={m}
            onDragStart={(e, m) => {
              if (e.currentTarget instanceof HTMLElement) {
                e.currentTarget.style.opacity = '0.5';
              }
              handleDragStart(e, m, title);
            }}
            isInvestment={false}
          />
        ))}
      </div>

      {description && (
        <div style={{
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#666',
          marginTop: 'auto',
          padding: '0.5rem',
          borderTop: '1px solid rgba(0,0,0,0.1)'
        }}>
          {description}
        </div>
      )}
    </div>
  );
};

export default DropZone;
