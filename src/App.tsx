import React, { useState } from 'react'; 
import { Developer, SprintData, ActiveInvestments} from './types';
import { DeveloperComponent } from './components/Developer';
import GameDropZone from './components/GameDropZone';
import { GameStats, TurnSummary } from './components/GameStats';
import { SprintChart } from './components/SprintChart';
import { ResultHistoryTable } from './components/ResultHistoryTable';
import { investmentConfigs } from './config/investmentsConfig';
import { initialDevelopers } from './config/developersConfig';
import { SprintCounter } from './components/SprintCounter';
import { handleDragStart, handleDrop } from './utils/dragHandlers';
import { handleBeginTurnLogic } from './game/gameLogic';
import Header from './components/Header';
import { generateChartData } from './utils/chartData';
import { RulesModal } from './components/RulesModal';
import { Layout } from './components/Layout';
import styles from './App.module.css';
import logo from './bagile-logo.svg';
import { BASE_RELEASE_CONFIDENCE, generateStartingHistory } from './utils/helpers';
import { debug } from 'console';

const maxSprintCount = 20;

export default function App() {
  const [developers, setDevelopers] = useState<Developer[]>([]); 
  const [developerPower, setDeveloperPower] = useState(5); 
  const [currentSprint, setCurrentSprint] = useState(10);
  const [techDebt, setTechDebt] = useState(100);
  const [resultHistory, setResultHistory] = useState<SprintData[]>(generateStartingHistory(10));
  const [showRules, setShowRules] = useState(true);
  const [mainArea, setMainArea] = useState<Developer[]>(initialDevelopers);
  const [completedInvestments, setCompletedInvestments] = useState<Set<string>>(new Set());
  const chartData = generateChartData(resultHistory, maxSprintCount);
  const disableTurn = developers.length > 0 || currentSprint >= maxSprintCount;
  const [prevTechDebt, setPrevTechDebt] = useState(techDebt);
  const [prevConfidence, setPrevConfidence] = useState(10);
  const [prevDevPower, setPrevDevPower] = useState(developerPower);

  const [resetSpinResultTrigger, setResetSpinResultTrigger] = useState(0);
  const [startReleaseSpin, setStartReleaseSpin] = useState(0);

  const [turnInProgress, setTurnInProgress] = useState(false);
  const [releaseStatus, setReleaseStatus] = useState<boolean | null>(null);

  const [activeInvestments, setActiveInvestments] = useState<ActiveInvestments>(
    investmentConfigs.reduce((acc, investment) => ({
      ...acc,
      [investment.name]: []
    }), {})
  );
  const [turnsRemaining, setTurnsRemaining] = useState<{ [key: string]: number | undefined }>(
    investmentConfigs.reduce((acc, investment) => ({
      ...acc,
      [investment.name]: undefined
    }), {})
  );

  const processTurn = async () => {

    if (turnInProgress) 
      return; // Prevent starting a new turn if one is already in progress

    setTurnInProgress(true); // Mark the turn as in progress
    
    // Immediately clear old spin result TODO: remove ResetSpinResultTrigge dont think we need anymore
   // setResetSpinResultTrigger(prev => prev + 1);

    // Wait for the spinner to complete
    const spinResult = await new Promise<boolean>((resolve) => {
      const checkSpinResult = () => {
       // debugger
        if (releaseStatus !== null) {
          resolve(releaseStatus); // Resolve when releaseStatus is updated
        } else {
          setTimeout(checkSpinResult, 50); // Poll every 100ms
        }
      };
      checkSpinResult();
    });

      // Define a callback to get the latest releaseStatus
    const getReleased = () => spinResult;


    const result = handleBeginTurnLogic(
      activeInvestments,
      investmentConfigs,
      turnsRemaining,
      completedInvestments,
      developers,
      mainArea,
      resultHistory,
      currentSprint,
      techDebt,
      developerPower, 
      getReleased // Pass the callback to get the latest releaseStatus
    );
  
    const clearedMainArea = mainArea.map(dev => ({
      ...dev,
      output: null,
      hasBug: null,
      working: false,
    }));

    setMainArea(clearedMainArea);

    if (result.developerPowerIncreased) {
      setDeveloperPower(prev => prev + 1);
    }
    
    setPrevTechDebt(techDebt);
    setPrevConfidence(currentSprintData.releaseConfidence);
    setPrevDevPower(developerPower);
  
    setTurnsRemaining(result.updatedTurns);
    setCompletedInvestments(result.updatedCompleted);
    setDevelopers(result.updatedDevelopers);
    setActiveInvestments(result.updatedActiveInvestments);
    setTechDebt(result.updatedTechDebt);

    await new Promise(resolve => setTimeout(resolve, 1000));

    for (let i = 0; i < mainArea.length; i++) {
      setMainArea(prev => {
        const updated = [...prev];
        updated[i] = { ...updated[i], working: true };
        return updated;
      });
  
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 400));
  
      // Update developer with output + bug
      setMainArea(prev => {
        const updated = [...prev];
        const dev = updated[i];
        const output = Math.floor(Math.random() * developerPower) + 1;
        const bugRoll = Math.random() * 100;
        const hasBug = bugRoll <= techDebt;
        updated[i] = { ...dev, output, hasBug, working: false };
        return updated;
      });
    }
    
    // Trigger the spinner
    setStartReleaseSpin((prev) => prev + 1);

    setResultHistory((prev) => {
      const lastSprint = prev[prev.length - 1]; // Get the last sprint data
      const accumulatedValueDelivered = lastSprint
        ? lastSprint.accumulatedValueDelivered + (result.turnSprintData.released ? result.turnSprintData.netValue : 0)
        : result.turnSprintData.released
        ? result.turnSprintData.netValue
        : 0;
    
      // Update the turnSprintData with the new accumulatedValueDelivered
      const updatedSprintData = {
        ...result.turnSprintData,
        accumulatedValueDelivered,
      };
    
      return [...prev, updatedSprintData];
    });
    setCurrentSprint(prev => {
      const nextSprint = prev + 1;
  
      if (nextSprint >= maxSprintCount && window.gtag) {
        window.gtag('event', 'game_completed', {
          event_category: 'gameplay',
          event_label: 'User completed the game',
        });
      }
  
      return nextSprint;
    });

    setTurnInProgress(false); // Mark the turn as finished
  };
  

  const onDrop = (
    event: React.DragEvent,
    targetArea: string,
    areaSetter: (updater: (prev: Developer[]) => Developer[]) => void
  ) => {
    if (turnInProgress) {
      console.warn('Cannot drop while a turn is in progress.');
      return; // Prevent dropping if a turn is in progress
    }

    handleDrop(
      event,
      targetArea,
      areaSetter,
      developers,
      mainArea,
      activeInvestments,
      setDevelopers,
      setMainArea,
      setActiveInvestments,
      setTurnsRemaining,
      investmentConfigs
    );
  };

  const handleDropZoneDoubleClick = (target: string) => {
    
    if (turnInProgress) {
      console.warn('Cannot assign developers while a turn is in progress.');
      return; // Prevent double-click actions if a turn is in progress
    }

    if (developers.length > 0) {
      // Take first available and assign to target area
      const [first, ...rest] = developers;
      setDevelopers(rest);
  
      if (target === 'Build') {
        setMainArea(prev => [...prev, first]);
      } else {
        setActiveInvestments(prev => ({
          ...prev,
          [target]: [...prev[target], first]
        }));
      }
    } else if (target !== 'Build' && mainArea.length > 0) {
      // Take from Build instead
      const [first, ...rest] = mainArea;
      setMainArea(rest);
      setActiveInvestments(prev => ({
        ...prev,
        [target]: [...prev[target], first]
      }));
    }
  };

  const getTurnButtonText = () => {
    if (currentSprint >= maxSprintCount) return 'Game Over';
    if (developers.length > 0) return 'Allocate Remaining Developers';
    return 'Begin Turn';
  };

  const currentSprintData = resultHistory[currentSprint - 1] || {
    sprintNumber: currentSprint,
    techDebt: 100,
    releaseConfidence: BASE_RELEASE_CONFIDENCE,
    devValue: 0,
    netValue: 0,
    bugs: 0,
    valueDelivered: 0,
    accumulatedValueDelivered: 0,
    released: false,
  };

  return (
    <Layout>
  <div className={styles.appContainer}>
      {/* Header centered, with Rules button on same row (top right) */}
      <div className={styles.headerWrapper}>
        <div className={styles.headerTitle}>
          <Header />
        </div>

        <button className={styles.rulesButton}
          onClick={() => setShowRules(true)}>
          Game Rules
        </button>
</div>

      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />

      {/* Build Game Area - 50/50 Split */}
      <div className={styles.gameArea}>
        <div className={styles.leftColumn}>

          {/* Game Parameters Box */}
          <GameStats
            techDebt={currentSprintData.techDebt}
            releaseConfidence={currentSprintData.releaseConfidence}
            developerValue={developerPower}
            prevTechDebt={prevTechDebt}
            prevConfidence={prevConfidence}
            prevDevPower={prevDevPower}
          />

          <GameDropZone 
            name="Build" 
            title={`Sprint ${currentSprint.toString()}`}
            area={mainArea} 
            setArea={setMainArea} 
            isBuildArea={true}  
            turnsRemaining={turnsRemaining}
            handleDoubleClick={() => handleDropZoneDoubleClick('Build')}
            handleDrop={onDrop}
            handleDragStart={handleDragStart}
            completedInvestments={completedInvestments}
            investmentConfigs={investmentConfigs}
            developerPower={developerPower}
            currentSprintData={currentSprintData}
            resetSpinResultTrigger={currentSprint}
            startReleaseSpin={startReleaseSpin}  
            onReleaseStatusChange={(status) => {
              setReleaseStatus(status); // Update releaseStatus in the parent
            }}
          />
          
<br/>
          <div className={styles.devPool}>
            {/* Hint inside the box */}
            <div style={{
              opacity: 0.5,
              fontSize: '0.85rem',
              textAlign: 'center',
              marginBottom: '0.5rem'
            }}>
              Drag or double-click to assign developers
            </div>
  
            <div className={styles.developers}>              
              {developers.map((m) => (
                  <DeveloperComponent 
                    key={`available-${m.id}`}
                    developer={m} 
                    onDragStart={(e, m) => {
                      if (e.currentTarget instanceof HTMLElement) {
                        e.currentTarget.style.opacity = '0.5';
                      }
                      handleDragStart(e, m, 'available');
                    }}
                    isInvestment={false}
                    developerPower={developerPower}
                  />
                ))}
            </div>
                    
          </div>     
          
          {/* Begin Turn Button */}
          <div className={styles.buttonWrapper}>
            <button
              className={`${styles.beginButton} ${disableTurn || turnInProgress ? styles.beginButtonDisabled : ''}`}
              onClick={processTurn}
              disabled={disableTurn || turnInProgress}
            >
              {getTurnButtonText()}
            </button>
          </div>
        </div>

        {/* Investment Area - 50% */}
        <div className={styles.rightColumn}>
          {investmentConfigs.map((investment) => (
            <GameDropZone
              name={investment.name}
              title={investment.name}
              area={activeInvestments[investment.name] || []}
              setArea={(updater: (prev: Developer[]) => Developer[]) =>
                setActiveInvestments((prev) => ({ ...prev, [investment.name]: updater(prev[investment.name]) }))
              }
              description={investment.description}
              maxDevelopers={investment.maxDevelopers}
              turnsToComplete={investment.turnsToComplete}
              turnsRemaining={turnsRemaining}
              handleDoubleClick={() => handleDropZoneDoubleClick(investment.name)}
              handleDrop={onDrop}
              handleDragStart={handleDragStart}
              completedInvestments={completedInvestments}
              investmentConfigs={investmentConfigs}
              developerPower={developerPower}
              currentSprintData={currentSprintData}
            />
          ))}
        </div>
        
      </div> 



      {/* Sprint Counter */}
      <SprintCounter currentSprint={currentSprint} maxSprints={maxSprintCount} />

      {/* Graph */}
      <SprintChart data={chartData} />
      {/* Sprint History Table */}
      <ResultHistoryTable data={resultHistory} />

      <hr style={{ marginTop: '3rem', marginBottom: '1rem' }} />

      <footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.9rem',
          color: '#666',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ textAlign: 'center', flex: 1 }}>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: '600'}}>
            <strong>Got ideas or feedback to improve the game? </strong>Email us at{' '}
            <a
              href="mailto:info@bagile.co.uk"
              style={{ color: '#4dabf7', textDecoration: 'none' }}
            >
              info@bagile.co.uk
            </a>
          </p>
          <br/>
          <p style={{ margin: 0 }}>
           Created by <strong>Alex Brown</strong> · © 2025{' '}
            <a href="https://www.bagile.co.uk" style={{ color: '#4dabf7', textDecoration: 'none' }}>
              bagile.co.uk
            </a> – Making agility part of your DNA.
          </p>
        </div>

        <img
          src={logo}
          alt="Bagile logo" className={styles.logoImage} 
        />
      </footer>
      </div>
    </Layout>
  );
} 