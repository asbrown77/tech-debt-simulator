import React, { useState } from 'react'; 
import { Developer, SprintData, ActiveInvestments} from './types';
import { appConfig } from './config/appconfig';

import GameDropZone from './components/GameDropZone';
import { GameStats } from './components/GameStats';
import { SprintChart } from './components/SprintChart';
import { ResultHistoryTable } from './components/ResultHistoryTable';
import { investmentConfigs } from './config/investmentsConfig';
import { initialDevelopers } from './config/developersConfig';
import { SprintCounter } from './components/SprintCounter';
import { handleDragStart, handleDrop } from './utils/dragHandlers';
import { handleBeginTurnLogic } from './game/gameLogic';
import Header from './components/Header';
import { RulesModal } from './components/RulesModal';
import { Layout } from './components/Layout';
import styles from './App.module.css';
import logo from './bagile-logo.svg';
import { BASE_RELEASE_PROBABILITY, BASE_TECH_DEBT, generateStartingHistory, resetDeveloper, uniqueDevelopers } from './utils/helpers';
import { debug } from 'console';
import { calculateDeveloperOutput } from './game/developerLogic';
import { GameEndModal } from './components/GameEndModel';

const maxSprintCount = 20;

export default function App() {
 // const [nonWorkingdevelopers, setDevelopers] = useState<Developer[]>([]); 
  const [developerPower, setDeveloperPower] = useState(5); 
  const [currentSprint, setCurrentSprint] = useState(10);
  const [techDebt, setTechDebt] = useState(BASE_TECH_DEBT);
  const [resultHistory, setResultHistory] = useState<SprintData[]>(generateStartingHistory(10));
  const [showRules, setShowRules] = useState(false);
  const [workingDevelopers, setMainArea] = useState<Developer[]>(initialDevelopers);
  const [completedInvestments, setCompletedInvestments] = useState<Set<string>>(new Set());
  //const chartData = generateChartData(resultHistory, maxSprintCount);
  const [prevTechDebt, setPrevTechDebt] = useState(techDebt);
  const [prevReleaseProbability, setPrevReleaseProbability] = useState(10);
  const [prevDevPower, setPrevDevPower] = useState(developerPower);
  const [showGameEndModal, setShowGameEndModal] = useState(false);
  const spinResolverRef = React.useRef<((value: boolean) => void) | null>(null);

  const chartData = resultHistory.map((sprint) => {
    const maxTechDebt = Math.max(...resultHistory.map((s) => s.techDebt || 0)); // Find the max tech debt

    return {
      ...sprint,
      sprintNumber: sprint.sprintNumber,
      releaseProbability: sprint.releaseProbability || BASE_RELEASE_PROBABILITY,
      devValue: sprint.devValue || 0,
      bugs: sprint.bugs || 0,
      valueDelivered: sprint.released ? sprint.netValue|| 0 : 0,
      accumulatedValueDelivered: sprint.accumulatedValueDelivered || 0,
      released: sprint.released || false,
      techDebt: sprint.techDebt, 
    };
  });

  const [resetTurnResultTrigger, setResetTurnResultTrigger] = useState(0);
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

    if (currentSprint >= maxSprintCount) {
      setShowGameEndModal(true); // Show the modal when the game ends
      resetGame(); // Reset the game if it's over
      return;
    }

    if (turnInProgress) return; 

    setTurnInProgress(true); 
    setReleaseStatus(null); 
    setResetTurnResultTrigger(prev => prev + 1);

    // Developer work BEFORE spinner
    for (let i = 0; i < workingDevelopers.length; i++) {
      setMainArea(prev => {
        const updated = [...prev];
        updated[i] = { ...updated[i], working: true };
        return updated;
      });
  
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 300));
  
      const { updatedDevelopers } = calculateDeveloperOutput([workingDevelopers[i]], developerPower, techDebt);
      setMainArea((prev) => {
        const updated = [...prev];
        updated[i] = updatedDevelopers[0]; // Update only the specific developer
        return updated;
      });
    }

    // Start spinner AFTER developer work
    const spinPromise = new Promise<boolean>((resolve) => {
      spinResolverRef.current = resolve;
    });

    setStartReleaseSpin((prev) => prev + 1);
    const spinResult = await spinPromise;
    const getReleased = () => spinResult;

        // Only AFTER spinner, apply investments and update state
    const result = handleBeginTurnLogic(
      activeInvestments,
      investmentConfigs,
      turnsRemaining,
      completedInvestments,
      workingDevelopers,
      resultHistory,
      currentSprint,
      techDebt,
      currentSprintData.releaseProbability,
      developerPower, 
      getReleased // Pass the callback to get the latest releaseStatus
    );
  
    // Reset developers in the Main Area
    const resetWorkingDevelopers = workingDevelopers.map(resetDeveloper);
    setMainArea(resetWorkingDevelopers);

    if (result.developerPowerIncreased) {; 
      setDeveloperPower(developerPower +1 );
    }
    
    setPrevTechDebt(techDebt);
    setPrevReleaseProbability(currentSprintData.releaseProbability);
    setPrevDevPower(developerPower);
  
    setTurnsRemaining(result.updatedTurns);
    setCompletedInvestments(result.updatedCompleted);
    setTechDebt(result.updatedTechDebt);

    let newWorkingDevelopers = uniqueDevelopers([...result.workingDevelopers, ...result.freeInvestedDevelopers]);
    setMainArea(newWorkingDevelopers);


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

    if (currentSprint >= maxSprintCount) {
      setShowGameEndModal(true); // Show the modal when the game ends
      return;
    }
  
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
      workingDevelopers,
      activeInvestments,
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
  
    if (target === 'Build') {
      // Look through investment areas
      for (const investmentName of Object.keys(activeInvestments)) {
        const area = activeInvestments[investmentName];
        if (area.length > 0) {
          const [first, ...rest] = area;
          const clearedDeveloper = resetDeveloper(first);
          setActiveInvestments((prev) => ({
            ...prev,
            [investmentName]: rest,
          }));
          setMainArea((prev) => [...prev, clearedDeveloper]);
          break; // only take one
        }
      }
    } else {
      // Default behavior: take from workingDevelopers
      if (workingDevelopers.length > 0) {
        const [first, ...rest] = workingDevelopers;
        setMainArea(rest);
        const clearedDeveloper = resetDeveloper(first);
  
        setActiveInvestments((prev) => ({
          ...prev,
          [target]: [...prev[target], clearedDeveloper],
        }));
      }
    }

  };

  const getTurnButtonText = () => {
    if (currentSprint >= maxSprintCount) return 'New Game';
    return 'Next Sprint';
  };

  const getTurnButtonClass = () => {
    if (currentSprint >= maxSprintCount) return styles.newGameButton; // Apply orange button style
    return styles.beginButton; // Default button style
  };
  
  const currentSprintData = resultHistory[currentSprint - 1] || {
    sprintNumber: currentSprint,
    techDebt: 5,
    releaseProbability: BASE_RELEASE_PROBABILITY,
    devValue: 0,
    netValue: 0,
    bugs: 0,
    valueDelivered: 0,
    accumulatedValueDelivered: 0,
    released: false,
  };

  const resetGame = () => {

    setCurrentSprint(1);
    setTechDebt(BASE_TECH_DEBT);
    setDeveloperPower(5);
    setResultHistory(generateStartingHistory(10));
    setCurrentSprint(10);
    setPrevTechDebt(BASE_TECH_DEBT);
    setActiveInvestments(
      investmentConfigs.reduce((acc, investment) => ({ ...acc, [investment.name]: [] }), {})
    );
    setCompletedInvestments(new Set());
    setMainArea(initialDevelopers);
    setTurnsRemaining(
      investmentConfigs.reduce((acc, investment) => ({ ...acc, [investment.name]: undefined }), {})
    );
    setShowGameEndModal(false); // Close the modal
  };

  return (
    <Layout>
      <div className={styles.appContainer}>
        {/* Header centered, with Rules button on same row (top right) */}
        <div className={styles.headerWrapper}>
          <div className={styles.headerTitle}>
            <Header />
          </div>

          <div className={styles.rulesButtonWrapper}>
            <button className={styles.rulesButton}
              onClick={() => setShowRules(true)}>
              How to Play
            </button>
          </div>
        </div>

        <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />

        {/* Build Game Area - 50/50 Split */}
        <div className={styles.gameArea}>
          <div className={styles.leftColumn}>

            {/* Game Parameters Box */}
            <GameStats
              techDebt={currentSprintData.techDebt}
              releaseProbability={currentSprintData.releaseProbability}
              developerValue={developerPower}
              prevTechDebt={techDebt}
              prevReleaseProbability={prevReleaseProbability}
              prevDevPower={prevDevPower}
            />

            <GameDropZone 
              name="Build" 
              title={`Sprint ${currentSprint.toString()}`}
              area={workingDevelopers} 
              setArea={setMainArea} 
              isBuildArea={true}  
              turnsRemaining={turnsRemaining}
              handleDoubleClick={() => handleDropZoneDoubleClick('Build')}
              handleDrop={onDrop}
              handleDragStart={handleDragStart}
              completedInvestments={completedInvestments}
              investmentConfigs={investmentConfigs}
              currentSprintData={currentSprintData}
              resetTurnResultTrigger={currentSprint}
              startReleaseSpin={startReleaseSpin}  
              turnInProgress={turnInProgress}
              onReleaseStatusChange={(status) => {
                setReleaseStatus(status);
                if (spinResolverRef.current) {
                  spinResolverRef.current(status); // ✅ resolve the promise
                  spinResolverRef.current = null; // clear after using
                }
              }}
            />
            
  <br/>     
            {/* Begin Turn Button */}
            <div className={styles.buttonWrapper}>
              <button
                className={`${getTurnButtonClass()} ${
                  turnInProgress ? styles.beginButtonDisabled : ''
                }`}
                onClick={processTurn}
                disabled={turnInProgress}
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
                currentSprintData={currentSprintData}
              />
            ))}
          </div>
          
        </div> 

        <GameEndModal isOpen={showGameEndModal}
          onClose={() => setShowGameEndModal(false)}
          resultHistory={resultHistory} techDebt={techDebt}
        />

        {/* Sprint Counter */}
        <SprintCounter currentSprint={currentSprint} maxSprints={maxSprintCount} />
        
        {/* Graph */}
        <SprintChart data={chartData} />
        
        {/* Sprint History Table */}
        <ResultHistoryTable data={resultHistory} />

        <hr style={{ marginTop: '3rem', marginBottom: '1rem' }} />
        <footer className={styles.footerContainer}>
          <div className={styles.footerText}>
            <p>
              <strong>Got ideas or feedback to improve the game? </strong>
              Email us at{' '}
              <a href="mailto:info@bagile.co.uk">
                info@bagile.co.uk
              </a>
            </p>
            <p>
              Created by <strong>Alex Brown</strong> · © 2025{' '}
              <a href="https://www.bagile.co.uk">
                bagile.co.uk
              </a> – Making agility part of your DNA.
            </p>
            <p style={{ fontSize: '0.8rem', color: '#999' }}>
              Version: {appConfig.version}
            </p>
          </div>
          <div className={styles.footerlogo}>
            <img src={logo} alt="Bagile logo" className={styles.logoImage} />
          </div>
        </footer>
      </div>    
    </Layout>
  );
} 