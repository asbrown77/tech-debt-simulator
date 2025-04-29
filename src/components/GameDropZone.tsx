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
  developerPower: number;
  currentSprintData: SprintData;
  resetSpinResultTrigger?: number;
  startSpinVersion?: number;
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
  developerPower,
  currentSprintData,
  resetSpinResultTrigger,
  startSpinVersion
}) => {
  const investmentConfig = investmentConfigs.find((config) => config.name === name);
  const isCompleted = !isBuildArea && completedInvestments.has(name);

  const [spinRequested, setSpinRequested] = React.useState(false);
  const [triggerSpin, setTriggerSpin] = React.useState(false);
  const [spinResult, setSpinResult] = React.useState<boolean | null>(null);


  const allowDrop = (event: React.DragEvent) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (isBuildArea) {
      setSpinResult(null);       // ✅ Clear old result
      setTriggerSpin(false);     // ✅ Prepare spinner (but don't spin yet)
    }
  }, [resetSpinResultTrigger]);
  
  useEffect(() => {
    if (isBuildArea) {
      setTriggerSpin(true);     // ✅ Start spinning AFTER devs finished
    }
  }, [startSpinVersion]);
  

  return (
    <div
      onDoubleClick={handleDoubleClick}
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
      <div className={styles.gameDropZoneHeader}>
        <strong>{title}</strong>
        {!isBuildArea && investmentConfig && (isCompleted || area.length === maxDevelopers) && (
          <div className={`${styles.turnsInfo} ${isCompleted ? styles.turnsComplete : ''}`}>
            {isCompleted ? 'Done' : `${turnsRemaining[name] ?? investmentConfig.turnsToComplete} turns`}
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
                  developerPower={developerPower}
                />
              ) : (
                <DeveloperPlaceholder />
              )}
            </div>
          ))}
      </div>

      {/* Show Sprint Summary inside Build only */}
      {isBuildArea && (
      <div className={styles.sprintSummary}>
        <div className={styles.summaryItem}>
          <strong>Output:</strong> {currentSprintData?.devOutput ?? 0}
        </div>
        <div className={styles.summaryItem}>
          <strong>Bugs:</strong> {currentSprintData?.bugs ?? 0}
        </div>
        <div className={styles.summaryItem}>
          <strong>Net Ouput:</strong> {currentSprintData?.netValue ?? 0}
        </div>
      </div>  
      )}
      
      {isBuildArea && (

      <div style={{ marginTop: '1rem' }}>
        <div>
          <strong>Release Successful?</strong>
        </div>
        {/* Always show spinner */}
        <ReleaseSpinnerRow
          confidence={currentSprintData.releaseConfidence ?? 0}
          triggerSpin={triggerSpin}
          resetSpinResultTrigger={resetSpinResultTrigger ?? 0 }
          onSpinComplete={(success) => {
            setSpinResult(success);
            setTriggerSpin(false);   // ✅ stop spinning after finish
          }}
        />
      </div>
      )}

      {description && <div className={styles.description}>{description}</div>}
    </div>
  );
};

export default GameDropZone;
