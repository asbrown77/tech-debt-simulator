import React from 'react';
import { Developer, SprintData } from '../types';
import { DeveloperComponent, DeveloperPlaceholder } from './Developer';
import styles from '../styles/GameDropzone.module.css';
import { ReleaseSpinnerRow } from './ReleaseSpinnerRow';
import { useEffect } from 'react';

type GameDropZoneProps = {
  name: string;
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
  currentSprintData: SprintData;
  resetTurnResultTrigger?: number;
  startReleaseSpin?: number
  onReleaseStatusChange?: (status: boolean) => void;
};

const GameDropZone: React.FC<GameDropZoneProps> = ({
  name,
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
  investmentConfigs,
  currentSprintData,
  resetTurnResultTrigger: resetSpinnerTrigger,
  startReleaseSpin, 
  onReleaseStatusChange,
}) => {
  const investmentConfig = investmentConfigs.find((config) => config.name === name);
  const isCompleted = !isBuildArea && completedInvestments.has(name);

  const [triggerReleaseSpin, setTriggerReleaseSpin] = React.useState(false);
  const [spinResult, setSpinResult] = React.useState<boolean | null>(null);

  const allowDrop = (event: React.DragEvent) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (isBuildArea) {
      setSpinResult(null);       // ✅ Clear old result
      setTriggerReleaseSpin(false);     // ✅ Prepare spinner (but don't spin yet)
    }
  }, [resetSpinnerTrigger]);

  useEffect(() => {
    if (isBuildArea) {
      setTriggerReleaseSpin(true);
    }
  }, [startReleaseSpin]);

  return (
    <div
      onDoubleClick={() => {
        if (!isCompleted) {
          handleDoubleClick?.();
        }
      }}
      onDrop={(e) => !isCompleted && handleDrop(e, name, setArea)}
      onDragOver={allowDrop}
      className={`${styles.gameDropZone} ${
        isCompleted
          ? styles.completed
          : isBuildArea
          ? styles.buildZone
          : styles.investmentZone
      }`}
    >
    <div className={`${styles.dropZoneHeader} ${isCompleted ? styles.completedDropZoneHeader : ''}`}>
      <strong>{title}</strong>
    </div>

    

    {turnsToComplete && !isBuildArea && investmentConfig && (!isCompleted  && area.length < (maxDevelopers ?? 0)) && (
      <div className={styles.turnsToComplete}>
        Turns to complete: {turnsToComplete}
      </div>
    )}
    {!isBuildArea && investmentConfig && (isCompleted || area.length === maxDevelopers) && (
      <div className={`${styles.turnsInfo} ${isCompleted ? styles.turnsComplete : ''}`}>
        {isCompleted ? 'Done' : `${turnsRemaining[name] ?? investmentConfig.turnsToComplete} turns to complete`}
      </div>
    )}

    <div
      style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: isBuildArea ? '150px' : '60px',
        flex: 1,
        alignContent: 'center'
      }}
    >
      {Array((isBuildArea ? 6 : maxDevelopers || 0))
        .fill(null)
        .map((_, index) => (
          <div key={`${name}-slot-${index}`} style={{ position: 'relative' }}>
            {area[index] ? (
              <DeveloperComponent
                key={`${name}-${area[index].id}`}
                developer={area[index]}
                onDragStart={(e, m) => {
                  if (e.currentTarget instanceof HTMLElement) {
                    e.currentTarget.style.opacity = '0.5';
                  }
                  handleDragStart(e, m, name);
                }}
                isInvestment={!isBuildArea}
              />
            ) : (
              <DeveloperPlaceholder />
            )}
          </div>
        ))}
      </div>

      
      <div style={{
              opacity: 0.5,
              fontSize: '0.85rem',
              textAlign: 'center',
              marginBottom: '0rem',
              color: '#666',
            }}>
              Drag or double-click to assign developers
            </div>
            
      {/* Show Sprint Summary inside Build only */}
      {isBuildArea && (
      <div className={styles.sprintSummary}>
        <div className={styles.summaryItem} style={{ color: 'cyan' }}>
          <strong>Dev:</strong> {currentSprintData?.devValue ?? 0}
        </div>
        <div className={styles.summaryItem} style={{ color: 'cyan' }}>
          <strong>Bugs:</strong> {currentSprintData?.bugs ?? 0}
        </div>
        <div className={styles.summaryItem}>
          <strong>Ouput:</strong> {currentSprintData?.netValue ?? 0}
        </div>
      </div>  
      )}


      {isBuildArea && (
      <div style={{ marginTop: '1rem' }}>

        {/* Always show spinner */}
        <ReleaseSpinnerRow
          releaseConfidence={currentSprintData.releaseConfidence ?? 0}
          triggerSpin={triggerReleaseSpin}
          resetSpinnerTrigger={resetSpinnerTrigger ?? 0 }
          onSpinComplete={(success) => {
            setSpinResult(success); // Update releaseStatus
            setTriggerReleaseSpin(false);   // ✅ stop spinning after finish
            onReleaseStatusChange?.(success); // Notify parent component
          }}
          netValue={currentSprintData.netValue ?? 0}
        />
      </div>

      
      )}

{description && (
  <div
    className={`${styles.description} ${isCompleted ? styles.completedDescription : ''}`}
  >
    {description}
  </div>
)}
    </div>
  );
};

export default GameDropZone;
