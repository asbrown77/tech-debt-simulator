import React from 'react';
import { Developer } from '../types';
import { DeveloperWithValue, DeveloperPlaceholder } from './Developer';
import styles from '../styles/Dropzone.module.css';

type DropZoneProps = {
  title: string;
  area: Developer[];
  setArea: (updater: (prev: Developer[]) => Developer[]) => void;
  description?: string;
  isBuildArea?: boolean;
  maxDevelopers?: number;
  turnsToComplete?: number;
  turnsRemaining: { [key: string]: number | undefined };
  handleDoubleClick?: () => void;
  handleDrop: (
    event: React.DragEvent,
    targetArea: string,
    areaSetter: (updater: (prev: Developer[]) => Developer[]) => void
  ) => void;
  handleDragStart: (
    event: React.DragEvent,
    developer: Developer,
    sourceArea?: string
  ) => void;
  completedInvestments: Set<string>;
  investmentConfigs: { name: string; maxDevelopers: number; turnsToComplete: number }[];
};

const DropZone: React.FC<DropZoneProps> = ({
  title,
  area,
  setArea,
  description,
  isBuildArea,
  maxDevelopers,
  turnsToComplete,
  turnsRemaining,
  handleDoubleClick,
  handleDrop,
  handleDragStart,
  completedInvestments,
  investmentConfigs
}) => {
  const investmentConfig = investmentConfigs.find((config) => config.name === title);
  const isCompleted = !isBuildArea && completedInvestments.has(title);

  const allowDrop = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      onDrop={(e) => !isCompleted && handleDrop(e, title, setArea)}
      onDragOver={allowDrop}
      className={`${styles.dropZone} ${
        isCompleted
          ? styles.completed
          : isBuildArea
          ? styles.buildZone
          : styles.investmentZone
      }`}
    >
      <div className={styles.dropZoneHeader}>
        <strong>{title}</strong>
        {!isBuildArea && investmentConfig && (isCompleted || area.length === maxDevelopers) && (
          <div className={`${styles.turnsInfo} ${isCompleted ? styles.turnsComplete : ''}`}>
            {isCompleted ? 'Done' : `${turnsRemaining[title] ?? investmentConfig.turnsToComplete} turns`}
          </div>
        )}
      </div>

      {turnsToComplete && (
        <div className={styles.turnsToComplete}>
          Turns to complete: {turnsToComplete}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: isBuildArea ? '200px' : '60px',
          flex: 1,
          alignContent: 'center'
        }}
      >
        {Array((isBuildArea ? 6 : maxDevelopers || 0))
          .fill(null)
          .map((_, index) => (
            <div key={`${title}-slot-${index}`} style={{ position: 'relative' }}>
              {area[index] ? (
                <DeveloperWithValue
                  key={`${title}-${area[index].id}`}
                  developer={area[index]}
                  onDragStart={(e, m) => {
                    if (e.currentTarget instanceof HTMLElement) {
                      e.currentTarget.style.opacity = '0.5';
                    }
                    handleDragStart(e, m, title);
                  }}
                  isInvestment={!isBuildArea}
                />
              ) : (
                <DeveloperPlaceholder />
              )}
            </div>
          ))}
      </div>

      {description && <div className={styles.description}>{description}</div>}
    </div>
  );
};

export default DropZone;
