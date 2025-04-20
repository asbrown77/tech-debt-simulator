import React, { useState } from 'react';
import { Meeple, SprintData} from './types';
import { MeepleWithValue } from './components/Meeple';
import DropZone from './components/DropZone';
import { GameStats } from './components/GameStats';
import { SprintChart } from './components/SprintChart';
import { ResultHistoryTable } from './components/ResultHistoryTable';
import { investmentConfigs } from './config/investments';
import { initialMeeples } from './config/meeples';
import { SprintCounter } from './components/SprintCounter';
import { handleDragStart, handleDrop } from './utils/dragHandlers';
import { handleBeginTurnLogic } from './utils/turnHandler';
import { Header } from './components/Header';
import { generateChartData } from './utils/chartData';
import { RulesModal } from './components/RulesModal';
import { Layout } from './components/Layout';
import styles from './App.module.css';
import logo from './bagile-logo.svg';
const maxSprintCount = 10;

export default function App() {
  const [meeples, setMeeples] = useState<Meeple[]>(initialMeeples);
  const [mainArea, setMainArea] = useState<Meeple[]>([]);
  const [activeInvestments, setActiveInvestments] = useState<{ [key: string]: Meeple[] }>(
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
  const [completedInvestments, setCompletedInvestments] = useState<Set<string>>(new Set());
  const [techDebt, setTechDebt] = useState(100);
  const [releaseConfidence, setConfidence] = useState(10);
  const [bugs, setBugs] = useState(0);
  const [cumulativeValue, setCumulativeValue] = useState(0);
  const [currentSprint, setCurrentSprint] = useState(0);
  const [resultHistory, setResultHistory] = useState<SprintData[]>([]);
  const chartData = generateChartData(resultHistory, maxSprintCount);
  const [showRules, setShowRules] = useState(true);

  const handleBeginTurn = () => {
    const result = handleBeginTurnLogic(
      activeInvestments,
      investmentConfigs,
      turnsRemaining,
      completedInvestments,
      techDebt,
      meeples,
      mainArea,
      resultHistory,
      currentSprint
    );
  
    setTurnsRemaining(result.updatedTurns);
    setCompletedInvestments(result.updatedCompleted);
    setMeeples(result.updatedMeeples);
    setMainArea(result.updatedMainArea);
    setActiveInvestments(result.updatedActiveInvestments);
    setTechDebt(result.updatedTechDebt);
    setConfidence(result.newSprint.releaseConfidence);
    setBugs(result.newSprint.bugs);
    setCumulativeValue(prev => prev + result.newSprint.devOutput);
    setResultHistory(prev => [...prev, result.newSprint]);
    setCurrentSprint(prev => prev + 1);
  };  


  const onDrop = (
    event: React.DragEvent,
    targetArea: string,
    areaSetter: (updater: (prev: Meeple[]) => Meeple[]) => void
  ) => {
    handleDrop(
      event,
      targetArea,
      areaSetter,
      meeples,
      mainArea,
      activeInvestments,
      setMeeples,
      setMainArea,
      setActiveInvestments,
      setTurnsRemaining,
      investmentConfigs
    );
  };
  
  const resetGame = () => {
    setMeeples(initialMeeples);
    setMainArea([]);
    setActiveInvestments(
      investmentConfigs.reduce((acc, investment) => ({
        ...acc,
        [investment.name]: []
      }), {})
    );
    setTurnsRemaining(
      investmentConfigs.reduce((acc, investment) => ({
        ...acc,
        [investment.name]: undefined
      }), {})
    );
    setCompletedInvestments(new Set());
    setTechDebt(100);
    setConfidence(10);
    setBugs(0);
    setCumulativeValue(0);
    setCurrentSprint(0);
    setResultHistory([]);
  };

  const disableTurn =
  meeples.length > 0 || currentSprint >= maxSprintCount;

  const getTurnButtonText = () => {
    if (currentSprint >= maxSprintCount) return 'Game Over';
    if (meeples.length > 0) return 'Allocate All Developers';
    return 'Begin Turn';
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
            <div className={styles.meeples}>              
              {meeples.map((m) => (
                  <MeepleWithValue 
                    key={`available-${m.id}`}
                    meeple={m} 
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
            handleDrop={onDrop}
            handleDragStart={handleDragStart}
            completedInvestments={completedInvestments}
            investmentConfigs={investmentConfigs}
          />
          
          {/* Game Parameters Box */}
          <GameStats
            techDebt={techDebt}
            releaseConfidence={releaseConfidence}
            cumulativeValue={cumulativeValue}
            bugs={bugs}
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
            
        </div>

        {/* Investment Area - 50% */}
        <div className={styles.rightColumn}>
          {investmentConfigs.map((investment) => (
            <DropZone
              key={investment.name}
              title={investment.name}
              area={activeInvestments[investment.name]}
              setArea={(updater) =>
                setActiveInvestments((prev) => ({ ...prev, [investment.name]: updater(prev[investment.name]) }))
              }
              color= "#efe"
              description={investment.description}
              maxMeeples={investment.maxMeeples}
              turnsToComplete={investment.turnsToComplete}
              turnsRemaining={turnsRemaining}
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