import React, { useEffect, useState } from 'react'; 
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
import { Layout } from './components/Layout';
import styles from './App.module.css';
import logo from './bagile-logo.svg';
import { BASE_RELEASE_PROBABILITY, BASE_TECH_DEBT, generateStartingHistory, resetDeveloper, STARING_DEV_POWER, uniqueDevelopers } from './utils/helpers';
import { calculateDeveloperOutput } from './game/developerLogic';
import { gameEndModalContent, rulesModalContent } from './components/ModalContent';
import { GeneralModal } from './components/GeneralModal';
import { gameMessages } from './config/gameMessages';
import { useGameMessage } from './utils/useGameMessage';
import { debug } from 'console';


const maxSprintCount = 20;


export default function App() {
  const { gameMessage, setGameMessage } = useGameMessage(); 
  const [developerPower, setDeveloperPower] = useState(STARING_DEV_POWER); 
  const [currentSprint, setCurrentSprint] = useState(10);
  const [techDebt, setTechDebt] = useState(BASE_TECH_DEBT);
  const [resultHistory, setResultHistory] = useState<SprintData[]>(generateStartingHistory(10));
  const [showRules, setShowRules] = useState(false);
  const [workingDevelopers, setMainArea] = useState<Developer[]>(initialDevelopers);
  const [completedInvestments, setCompletedInvestments] = useState<Set<string>>(new Set());
  const [prevTechDebt, setPrevTechDebt] = useState(techDebt);
  const [prevReleaseProbability, setPrevReleaseProbability] = useState(10);
  const [prevDevPower, setPrevDevPower] = useState(developerPower);
  const [showGameEndModal, setShowGameEndModal] = useState(false);
  const spinResolverRef = React.useRef<((value: boolean) => void) | null>(null);

  const chartData = resultHistory.map((sprint) => {
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

  useEffect(() => {
    if (gameMessages[currentSprint]) {
      setGameMessage({
        isOpen: true,
        content: gameMessages[currentSprint],
      });
    }
  }, [currentSprint]);
  
  const processTurn = async () => {
    if (currentSprint >= maxSprintCount) {
      resetGame(); // Reset the game 
      return;
    }

    if (turnInProgress) return; 

    let latestDevelopers: Developer[] = [...workingDevelopers];

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
  
      debugger
      const { updatedDevelopers } = calculateDeveloperOutput([workingDevelopers[i]], developerPower, techDebt);

      latestDevelopers[i] = {
        ...latestDevelopers[i],
        ...updatedDevelopers[0],
      };

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

    debugger;
        // Only AFTER spinner, apply investments and update state
    const result = handleBeginTurnLogic(
      activeInvestments,
      investmentConfigs,
      turnsRemaining,
      completedInvestments,
      latestDevelopers,
      resultHistory,
      currentSprint,
      techDebt,
      currentSprintData.releaseProbability,
      developerPower, 
      getReleased // Pass the callback to get the latest releaseStatus
    );
  
    if (result.developerPowerIncreased) {; 
      setDeveloperPower(developerPower +1 );
    }
    
    setPrevTechDebt(techDebt);
    setPrevReleaseProbability(currentSprintData.releaseProbability);
    setPrevDevPower(developerPower);
  
    setTurnsRemaining(result.updatedTurns);
    setCompletedInvestments(result.updatedCompleted);
    setTechDebt(result.updatedTechDebt);
    debugger;
    setMainArea(prev => uniqueDevelopers([...prev, ...result.freeInvestedDevelopers.map(resetDeveloper)]));

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

    if (currentSprint >= maxSprintCount-1) {
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
    return 'Next Iteration';
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
    setDeveloperPower(STARING_DEV_POWER);
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

  const gameEndContent = gameEndModalContent(resultHistory, techDebt);

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
              onClick={() => {
                if (window.gtag) {
                  window.gtag('event', 'click', {
                    event_category: 'Game',
                    event_label: 'How to Play Button'
                  });
                }
                setShowRules(true);
              }}>
              How to Play
            </button>
          </div>
        </div>

        {/* <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} /> */}

        <GeneralModal
            isOpen={showRules}
            onClose={() => setShowRules(false)}
            buttonText={rulesModalContent.buttonText}
          >
          {rulesModalContent.body}
        </GeneralModal>

        <GeneralModal
            isOpen={gameMessage.isOpen}
            onClose={() => setGameMessage({ isOpen: false, content: null })}
          >
          {gameMessage.content}
        </GeneralModal>

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
              title={`Iteration ${currentSprint.toString()}`}
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
                onClick={() => {
                  if (window.gtag) {
                      window.gtag('event', 'click', {
                        event_category: 'Game',
                        event_label: 'Next Iteration Button'
                      });
                    }
                    processTurn();
                  }}
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


        {/* <GameEndModal isOpen={showGameEndModal}
          onClose={() => setShowGameEndModal(false)}
          resultHistory={resultHistory} techDebt={techDebt}
        /> */}

        <GeneralModal
            isOpen={showGameEndModal}
            onClose={() => {
              setShowGameEndModal(false);
            }}
          >
          {gameEndContent.body}
        </GeneralModal>

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