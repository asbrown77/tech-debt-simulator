import React, { useState } from 'react';
import { Meeple, SprintData} from './types';
import { MeepleWithValue, MeeplePlaceholder } from './components/Meeple';
import DropZone from './components/DropZone';
import { GameStats } from './components/GameStats';
import { SprintChart } from './components/SprintChart';
import { ResultHistoryTable } from './components/ResultHistoryTable';
import { investmentConfigs } from './config/investments';
import { initialMeeples } from './config/meeples';
import { SprintCounter } from './components/SprintCounter';
import { handleDragStart, handleDrop, allowDrop } from './utils/dragHandlers';
import { handleBeginTurnLogic } from './utils/turnHandler';
import { Header } from './components/Header';
import { generateChartData } from './utils/chartData';

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

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>

    <Header />

    {/* Build Game Area - 50/50 Split */}
    <div style={{ 
      display: 'flex', 
      gap: '2rem', 
      marginBottom: '2rem',
      minHeight: '400px'
    }}>
        {/* Build - 50% */}
        <div style={{ flex: '0 0 50%' }}>
         
         {/* Available Developers */}
        <div style={{ 
          marginBottom: '2rem', 
          border: '2px dashed #ccc', 
          padding: '1rem',
          borderRadius: 8
        }}>
          <strong>Available Developers</strong>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
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
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            marginTop: '1rem'
          }}>
            <button 
              onClick={() => {
                console.log('Button clicked');
                handleBeginTurn();
              }}
              disabled={meeples.length > 0 || currentSprint >= maxSprintCount }
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: meeples.length > 0 || currentSprint >= maxSprintCount ? '#ccc' : '#4dabf7',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: meeples.length > 0 || currentSprint >= maxSprintCount ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                opacity: meeples.length > 0 || currentSprint >= maxSprintCount ? 0.7 : 1
              }}
            >
                {currentSprint >= maxSprintCount 
                ? 'Game Over'
                : meeples.length > 0
                    ? 'Allocate All Developers'
                    : 'Begin Turn'}
            </button>

          </div>
          
        </div>

        {/* Investment Area - 50% */}
        <div style={{ 
          flex: '0 0 50%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '1rem'
        }}>
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
    </div>
  );
} 