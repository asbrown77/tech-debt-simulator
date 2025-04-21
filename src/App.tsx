import React, { useState } from 'react';
import { Developer, SprintData} from './types';
import { DeveloperWithValue } from './components/Developer';
import DropZone from './components/DropZone';
import { GameStats, TurnValues } from './components/GameStats';
import { SprintChart } from './components/SprintChart';
import { ResultHistoryTable } from './components/ResultHistoryTable';
import { investmentConfigs } from './config/investments';
import { initialDevelopers } from './config/developers';
import { SprintCounter } from './components/SprintCounter';
import { handleDragStart, handleDrop } from './utils/dragHandlers';
import { handleBeginTurnLogic } from './game/gameLogic';
import { Header } from './components/Header';
import { generateChartData } from './utils/chartData';
import { RulesModal } from './components/RulesModal';
import { Layout } from './components/Layout';
import styles from './App.module.css';
import logo from './bagile-logo.svg';

const maxSprintCount = 10;

export default function App() {
  const [developers, setDevelopers] = useState<Developer[]>(initialDevelopers); 
  const [currentSprint, setCurrentSprint] = useState(0);
  const [techDebt, setTechDebt] = useState(100);
  const [resultHistory, setResultHistory] = useState<SprintData[]>([]);
  const [showRules, setShowRules] = useState(true);
  const [mainArea, setMainArea] = useState<Developer[]>([]);
  const [completedInvestments, setCompletedInvestments] = useState<Set<string>>(new Set());
  const chartData = generateChartData(resultHistory, maxSprintCount);
  const disableTurn = developers.length > 0 || currentSprint >= maxSprintCount;

  const [activeInvestments, setActiveInvestments] = useState<{ [key: string]: Developer[] }>(
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

  const handleBeginTurn = () => {
    const result = handleBeginTurnLogic(
      activeInvestments,
      investmentConfigs,
      turnsRemaining,
      completedInvestments,
      developers,
      mainArea,
      resultHistory,
      currentSprint,
      techDebt
    );
  
    setTurnsRemaining(result.updatedTurns);
    setCompletedInvestments(result.updatedCompleted);
    setDevelopers(result.updatedDevelopers);
    setMainArea(result.updatedMainArea);
    setActiveInvestments(result.updatedActiveInvestments);
    setTechDebt(result.updatedTechDebt);
    setResultHistory(prev => [...prev, result.newSprint]);
    setCurrentSprint(prev => prev + 1);
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
    if (developers.length > 0) return 'Allocate All Developers';
    return 'Begin Turn';
  };

  const currentSprintData = resultHistory[currentSprint - 1] || {
    techDebt: 100,
    releaseConfidence: 10,
    bugs: 0,
    netValue: 0,
    devOutput: 0,
    released: false
  };

  return (
    <Layout>

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
          <div className={styles.devPool}>
            <strong>Available Developers</strong>
            <div className={styles.developers}>              
              {developers.map((m) => (
                  <DeveloperWithValue 
                    key={`available-${m.id}`}
                    developer={m} 
                    onDragStart={(e, m) => {
                      if (e.currentTarget instanceof HTMLElement) {
                        e.currentTarget.style.opacity = '0.5';
                      }
                      handleDragStart(e, m, 'available');
                    }}
                    isInvestment={false}
                  />
                ))}
            </div>
                    
          </div>

          <DropZone 
            title="Build" 
            area={mainArea} 
            setArea={setMainArea} 
            color="#eef"
            isBuildArea={true}  
            turnsRemaining={turnsRemaining}
            handleDoubleClick={() => handleDropZoneDoubleClick('Build')}
            handleDrop={onDrop}
            handleDragStart={handleDragStart}
            completedInvestments={completedInvestments}
            investmentConfigs={investmentConfigs}
          />
          

          {/* Begin Turn Button */}
          <div className={styles.buttonWrapper}>
            <button
              className={`${styles.beginButton} ${disableTurn ? styles.beginButtonDisabled : ''}`}
              onClick={handleBeginTurn}
              disabled={disableTurn}
            >
              {getTurnButtonText()}
            </button>
          </div>

<br/>
          {/* Game Parameters Box */}
          <GameStats
            techDebt={currentSprintData.techDebt}
            releaseConfidence={currentSprintData.releaseConfidence}
            cumulativeValue={resultHistory.reduce((sum, s) => sum + s.devOutput, 0)}
            bugs={currentSprintData.bugs}
          />

          <TurnValues
            value={currentSprintData.devOutput}
            bugs={currentSprintData.bugs}
            netValue={currentSprintData.netValue}
            successfulRelease={currentSprintData.released}
          />
            
        </div>

        {/* Investment Area - 50% */}
        <div className={styles.rightColumn}>
          {investmentConfigs.map((investment) => (
            <DropZone
              key={investment.name}
              title={investment.name}
              area={activeInvestments[investment.name] || []}
              setArea={(updater) =>
                setActiveInvestments((prev) => ({ ...prev, [investment.name]: updater(prev[investment.name]) }))
              }
              color= "#efe"
              description={investment.description}
              maxDevelopers={investment.maxDevelopers}
              turnsToComplete={investment.turnsToComplete}
              turnsRemaining={turnsRemaining}
              handleDoubleClick={() => handleDropZoneDoubleClick(investment.name)}
              handleDrop={onDrop}
              handleDragStart={handleDragStart}
              completedInvestments={completedInvestments}
              investmentConfigs={investmentConfigs}
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
          <p style={{ margin: 5 }}>
            <strong>Got feedback or ideas to improve the game? </strong>Email us at{' '}
            <a
              href="mailto:alexbrow@bagile.co.uk"
              style={{ color: '#4dabf7', textDecoration: 'none' }}
            >
              alexbrow@bagile.co.uk
            </a>
          </p>
          <p style={{ margin: 0 }}>
            © 2024{' '}
            <a
              href="https://www.bagile.co.uk"
              style={{ color: '#4dabf7', textDecoration: 'none' }}
            >
              bagile.co.uk
            </a>{' '}
            - Making agility part of your DNA.
          </p>
        </div>

        <img
          src={logo}
          alt="Bagile logo"
          style={{
            height: '32px',
            marginRight: '1rem',
          }}
        />
      </footer>

    </Layout>
  );
} 