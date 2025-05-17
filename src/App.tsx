import React, { useEffect, useState } from 'react'; 
import { Developer, IterationData, ActiveInvestments} from './types';
import { appConfig } from './config/appconfig';

import GameDropZone from './components/GameDropZone';
import { GameStats } from './components/GameStats';
import { IterationChart } from './components/IterationChart';
import { ResultHistoryTable } from './components/ResultHistoryTable';
import { investmentConfigs } from './config/investmentsConfig';
import { initialDevelopers } from './config/developersConfig';
import { IterationCounter } from './components/IterationCounter';
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
import { GameHistory } from './components/GameHistory';

const maxIterationCount = 20;


export default function App() {
  const { gameMessage, setGameMessage } = useGameMessage(); 
  const [developerPower, setDeveloperPower] = useState(STARING_DEV_POWER); 
  const [currentIteration, setCurrentIteration] = useState(10);
  const [techDebt, setTechDebt] = useState(BASE_TECH_DEBT);
  const [resultHistory, setResultHistory] = useState<IterationData[]>(generateStartingHistory(10));
  const [showRules, setShowRules] = useState(false);
  const [workingDevelopers, setMainArea] = useState<Developer[]>(initialDevelopers);
  const [completedInvestments, setCompletedInvestments] = useState<Set<string>>(new Set());
  const [prevTechDebt, setPrevTechDebt] = useState(techDebt);
  const [prevReleaseProbability, setPrevReleaseProbability] = useState(10);
  const [prevDevPower, setPrevDevPower] = useState(developerPower);
  const [showGameEndModal, setShowGameEndModal] = useState(false);
  const spinResolverRef = React.useRef<((value: boolean) => void) | null>(null);
const [replayHistory, setReplayHistory] = useState<IterationData[] | null>(null);
const [replayTitle, setReplayTitle] = useState<string>('');
const [showReplayModal, setShowReplayModal] = useState(false);

  const chartData = resultHistory.map((iteration) => {
    return {
      ...iteration,
      iterationNumber: iteration.iterationNumber,
      releaseProbability: iteration.releaseProbability || BASE_RELEASE_PROBABILITY,
      devValue: iteration.devValue || 0,
      bugs: iteration.bugs || 0,
      valueDelivered: iteration.released ? iteration.netValue|| 0 : 0,
      accumulatedValueDelivered: iteration.accumulatedValueDelivered || 0,
      released: iteration.released || false,
      techDebt: iteration.techDebt, 
    };
  });

const loadPastGame = (history: IterationData[], name: string) => {
  setReplayHistory(history);
  setReplayTitle(name);
  setShowReplayModal(true);
};

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
    if (gameMessages[currentIteration]) {
      setGameMessage({
        isOpen: true,
        content: gameMessages[currentIteration],
      });
    }
  }, [currentIteration]);
  

  const processTurn = async () => {
    if (currentIteration >= maxIterationCount) {
      resetGame(); // Reset the game 
      return;
    }

    // Clear developers in the Main Area (Reset)
    const resetWorkingDevelopers = workingDevelopers.map(resetDeveloper);
    setMainArea(resetWorkingDevelopers);

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
      currentIteration,
      techDebt,
      currentIterationData.releaseProbability,
      developerPower, 
      getReleased // Pass the callback to get the latest releaseStatus
    );

    if (result.developerPowerIncreased) {; 
      setDeveloperPower(developerPower +1 );
    }
    
    setPrevTechDebt(techDebt);
    setPrevReleaseProbability(currentIterationData.releaseProbability);
    setPrevDevPower(developerPower);
  
    setTurnsRemaining(result.updatedTurns);
    setCompletedInvestments(result.updatedCompleted);
    setTechDebt(result.updatedTechDebt);
    debugger;
    setMainArea(prev => uniqueDevelopers([...prev, ...result.freeInvestedDevelopers.map(resetDeveloper)]));

    setResultHistory((prev) => {
      const lastIteration = prev[prev.length - 1]; // Get the last iteration data
      const accumulatedValueDelivered = lastIteration
        ? lastIteration.accumulatedValueDelivered + (result.turnIterationData.released ? result.turnIterationData.netValue : 0)
        : result.turnIterationData.released
        ? result.turnIterationData.netValue
        : 0;
    
      // Update the turnIterationData with the new accumulatedValueDelivered
      const updatedIterationData = {
        ...result.turnIterationData,
        accumulatedValueDelivered,
      };
    
      return [...prev, updatedIterationData];
    });

    setCurrentIteration(prev => {
      const nextIteration = prev + 1;

      if (nextIteration >= maxIterationCount && window.gtag) {
        window.gtag('event', 'game_completed', {
          event_category: 'gameplay',
          event_label: 'User completed the game',
        });
      }
  
      return nextIteration;
    });

    setTurnInProgress(false); // Mark the turn as finished

    if (currentIteration >= maxIterationCount-1) {
      setShowGameEndModal(true); // Show the modal when the game ends

      const previousGames = JSON.parse(localStorage.getItem('gameSessions') || '[]');

      const defaultName = `Game ${previousGames.length + 1}`;
      const name = window.prompt(
        'Give this game a name (e.g. scenario played, theme, or focus):',
        defaultName
      ) || defaultName;

      const newGame = {
        name,
        timestamp: Date.now(),
        resultHistory,
      };


      localStorage.setItem('gameSessions', JSON.stringify([...previousGames, newGame]));


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
    if (currentIteration >= maxIterationCount) return 'New Game';
    return 'Next Iteration';
  };

  const getTurnButtonClass = () => {
    if (currentIteration >= maxIterationCount) return styles.newGameButton; // Apply orange button style
    return styles.beginButton; // Default button style
  };
  
  const currentIterationData = resultHistory[currentIteration - 1] || {
    iterationNumber: currentIteration,
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

    setCurrentIteration(1);
    setTechDebt(BASE_TECH_DEBT);
    setDeveloperPower(STARING_DEV_POWER);
    setResultHistory(generateStartingHistory(10));
    setCurrentIteration(10);
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
        
        {/*Modal Windows*/}
        <GeneralModal
            isOpen={showRules}
            onClose={() => setShowRules(false)}
            buttonText={rulesModalContent.buttonText}
          >
          {rulesModalContent.body}
        </GeneralModal>

      <GeneralModal
        isOpen={showReplayModal}
        onClose={() => setShowReplayModal(false)}
        buttonText="Close"
      >
        {replayHistory && (
          <>
            <h3 style={{ marginBottom: '1rem' }}>{replayTitle}</h3>
            <IterationChart data={replayHistory} />
            <ResultHistoryTable data={replayHistory} />
          </>
        )}
      </GeneralModal>


        <GeneralModal
            isOpen={gameMessage.isOpen}
            onClose={() => setGameMessage({ isOpen: false, content: null })}
          >
          {gameMessage.content}
        </GeneralModal>

        <GeneralModal
            isOpen={showGameEndModal}
            onClose={() => {
              setShowGameEndModal(false);
            }}
          >
          {gameEndContent.body}
        </GeneralModal>

        {/* Build Game Area - 50/50 Split */}
        <div className={styles.gameArea}>
          <div className={styles.leftColumn}>

            {/* Game Header Stat Box */}
            <GameStats
              techDebt={currentIterationData.techDebt}
              releaseProbability={currentIterationData.releaseProbability}
              developerValue={developerPower}
              prevTechDebt={techDebt}
              prevReleaseProbability={prevReleaseProbability}
              prevDevPower={prevDevPower}
            />

            <GameDropZone 
              name="Build" 
              title={`Iteration ${currentIteration.toString()}`}
              area={workingDevelopers} 
              setArea={setMainArea} 
              isBuildArea={true}  
              turnsRemaining={turnsRemaining}
              handleDoubleClick={() => handleDropZoneDoubleClick('Build')}
              handleDrop={onDrop}
              handleDragStart={handleDragStart}
              completedInvestments={completedInvestments}
              investmentConfigs={investmentConfigs}
              currentIterationData={currentIterationData}
              resetTurnResultTrigger={currentIteration}
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
            {/* Next Iteration Button */}
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
                currentIterationData={currentIterationData}
              />
            ))}
          </div>
          
        </div> 

        {/* Iteration Counter */}
        <IterationCounter currentIteration={currentIteration} maxIterations={maxIterationCount} />
        
        {/* Graph */}
        <IterationChart data={chartData} />
        
        {/* Iteration History Table */}
        <ResultHistoryTable data={resultHistory} />

<GameHistory onLoadGame={loadPastGame} />

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