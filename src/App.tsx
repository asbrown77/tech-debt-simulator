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
import { generateStartingHistory } from './utils/helpers';

const maxSprintCount = 20;

export default function App() {
  const [developers, setDevelopers] = useState<Developer[]>(initialDevelopers); 
  const [developerPower, setDeveloperPower] = useState(5); 
  const [currentSprint, setCurrentSprint] = useState(10);
  const [techDebt, setTechDebt] = useState(100);
  const [resultHistory, setResultHistory] = useState<SprintData[]>(generateStartingHistory(10));
  const [showRules, setShowRules] = useState(true);
  const [mainArea, setMainArea] = useState<Developer[]>([]);
  const [completedInvestments, setCompletedInvestments] = useState<Set<string>>(new Set());
  const chartData = generateChartData(resultHistory, maxSprintCount);
  const disableTurn = developers.length > 0 || currentSprint >= maxSprintCount;
  const [prevTechDebt, setPrevTechDebt] = useState(techDebt);
  const [prevConfidence, setPrevConfidence] = useState(10);
  const [prevDevPower, setPrevDevPower] = useState(developerPower);
  const [clearSpinResultVersion, setClearSpinResultVersion] = useState(0);

  const [resetSpinResultTrigger, setResetSpinResultTrigger] = useState(0);
  const [startSpinVersion, setStartSpinVersion] = useState(0);

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

    // Immediately clear old spin result
    setResetSpinResultTrigger(prev => prev + 1);

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
      developerPower
    );
  
    const clearedMainArea = mainArea.map(dev => ({
      ...dev,
      output: null,
      hasBug: null,
      working: false,
    }));

    setMainArea(clearedMainArea);
    setClearSpinResultVersion(prev => prev + 1);

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

    for (let i = 0; i < mainArea.length; i++) {
      setMainArea(prev => {
        const updated = [...prev];
        updated[i] = { ...updated[i], working: true };
        return updated;
      });
  
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 800));
  
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

      // temp fix until fix timer on both release spinner and dev
      if (i == 2) {
        setStartSpinVersion(prev => prev + 1);
      }
    }
  
    // After all devs finished working → finalize sprint data
      // now devs are done
     // setStartSpinVersion(prev => prev + 1);

    setResultHistory(prev => [...prev, result.turnSprintData]);
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
  };
  

  const onDrop = (
    event: React.DragEvent,
    targetArea: string,
    areaSetter: (updater: (prev: Developer[]) => Developer[]) => void
  ) => {
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
    releaseConfidence: 10,
    devOutput: 0,
    netValue: 0,
    bugs: 0,
    totalValueDelivered: 0,
    released: false,
    roll: 0, 
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
            startSpinVersion={startSpinVersion}
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
              className={`${styles.beginButton} ${disableTurn ? styles.beginButtonDisabled : ''}`}
              onClick={processTurn}
              disabled={disableTurn}
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

      <TurnSummary
            value={currentSprintData.devOutput}
            bugs={currentSprintData.bugs}
            netValue={currentSprintData.netValue}
            successfulRelease={currentSprintData.released}
          />
          
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