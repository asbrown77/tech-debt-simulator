import React from 'react';
import { Developer, SprintData } from '../types';
import { DeveloperWithValue, DeveloperPlaceholder } from './Developer';
import styles from '../styles/Dropzone.module.css';
import { ReleaseSpinnerRow } from './ReleaseSpinnerRow';
import { useEffect } from 'react';

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
  developerPower: number;
  currentSprintData: SprintData;
  resetSpinResultTrigger?: number;
  clearSpinResultVersion?: number;
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
  investmentConfigs,
  developerPower,
  currentSprintData,
  resetSpinResultTrigger,
  clearSpinResultVersion,
}) => {
  const investmentConfig = investmentConfigs.find((config) => config.name === title);
  const isCompleted = !isBuildArea && completedInvestments.has(title);

  const [spinRequested, setSpinRequested] = React.useState(false);
  const [spinResult, setSpinResult] = React.useState<boolean | null>(null);


  const allowDrop = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // When new sprint starts
  useEffect(() => {
    if (isBuildArea) {
      setSpinRequested(true);
      setSpinResult(null); // important: clear immediately
    }
  }, [resetSpinResultTrigger]);

  // When click Begin Turn button
  useEffect(() => {
    if (clearSpinResultVersion !== undefined && isBuildArea) {
      setSpinResult(null);
    }
  }, [clearSpinResultVersion]);
  

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

        {spinRequested && (
          <ReleaseSpinnerRow
            confidence={currentSprintData.releaseConfidence ?? 0}
            triggerSpin={spinRequested}
            onSpinComplete={(success) => {
              setSpinRequested(false);
              setSpinResult(success);
            }}
          />
        )}

        {spinResult !== null && (
          <div style={{ marginTop: '0.5rem', fontWeight: 'bold', textAlign: 'center'}}>
            {spinResult ? '✅ Released!' : '❌ Failed!'}
          </div>
        )}
      </div>
    )}



      {/* {isBuildArea && currentSprintData && (
        <div className={styles.releaseSummary}>
          <div>
            <strong>Release Confidence:</strong> {currentSprintData.releaseConfidence ?? 0}%
          </div>
          <div>
            <strong>Roll:</strong> 🎲 {currentSprintData.roll ?? '-'}
          </div>

          <div>
            {currentSprintData.released ? '👍🏻 Released!' : '👎🏻 Failed'}
          </div>
        </div>
      )} */}

      {description && <div className={styles.description}>{description}</div>}
    </div>
  );
};

export default DropZone;
