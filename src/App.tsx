import React, { useState } from 'react';
import developerIcon from './developer.svg';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Meeple = {
  id: number;
  name: string;
  value: number;
  turnsRemaining?: number;
};

const maxSprintCount = 10;
const initialMeeples: Meeple[] = [
  { id: 1, name: 'Dev 1', value: 5 },
  { id: 2, name: 'Dev 2', value: 5 },
  { id: 3, name: 'Dev 3', value: 5 },
  { id: 4, name: 'Dev 4', value: 5 },
  { id: 5, name: 'Dev 5', value: 5 },
  { id: 6, name: 'Dev 6', value: 5 }
];

class BaseInvestment {
  confidenceIncrease?: number;
  techDebtReduction?: number;
  increaseValue?: boolean;

  get description(): string {
    return formatDescription(this);
  }
}

// Investment configuration
type InvestmentConfig = BaseInvestment & {
  name: string;
  maxMeeples: number;
  turnsToComplete: number;
};

const formatDescription = (config: BaseInvestment): string => {
  const parts = [];
  if (config.confidenceIncrease)
    parts.push(`+${config.confidenceIncrease}% confidence`);
  if (config.techDebtReduction)
    parts.push(`-${config.techDebtReduction} tech debt`);
  if (config.increaseValue)
    parts.push('+1 value');
  return parts.join(', ');
};

const investmentConfigs: InvestmentConfig[] = [
  Object.assign(new BaseInvestment(), {
    name: 'CI/CD',
    maxMeeples: 3,
    turnsToComplete: 2,
    confidenceIncrease: 65,
    techDebtReduction: 1,
    increaseValue: true
  }),
  Object.assign(new BaseInvestment(), {
    name: 'Test Coverage',
    maxMeeples: 2,
    turnsToComplete: 2,
    confidenceIncrease: 25,
    techDebtReduction: 1,
    increaseValue: true
  }),
  Object.assign(new BaseInvestment(), {
    name: 'Code Quality',
    maxMeeples: 2,
    turnsToComplete: 1,
    techDebtReduction: 1,
    increaseValue: true
  }),
  Object.assign(new BaseInvestment(), {
    name: 'Reduce Complexity',
    maxMeeples: 1,
    turnsToComplete: 2,
    techDebtReduction: 3
  })
];

type SprintData = {
  sprintNumber: number;
  techDebt: number;
  releaseConfidence: number;
  devOutput: number;
  netValue: number;
  delivered: number;
  bugs: number;
  released: boolean;
};

const BASE_TECH_DEBT = 5; // Maximum tech debt value

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
  const [activeBonuses, setActiveBonuses] = useState<{
    techDebt: number;
  }>({
    techDebt: 0
  });

  function uniqueMeeples(meeples: Meeple[]): Meeple[] {
    const seen = new Map<number, Meeple>();
    for (const m of meeples) {
      const existing = seen.get(m.id);

      // Only replace if this meeple has a higher value
      if (!existing || m.value > existing.value) {
        seen.set(m.id, m);
      }
    }
    return Array.from(seen.values());
  }


  const [techDebt, setTechDebt] = useState(100);
  const [releaseConfidence, setConfidence] = useState(10);
  const [bugs, setBugs] = useState(0);
  const [cumulativeValue, setCumulativeValue] = useState(0);
  const [currentSprint, setCurrentSprint] = useState(0);
  const [sprintHistory, setSprintHistory] = useState<SprintData[]>([]);

  const handleDragStart = (event: React.DragEvent, meeple: Meeple, sourceArea?: string) => {
    event.dataTransfer.setData('meepleId', meeple.id.toString());
    event.dataTransfer.setData('sourceArea', sourceArea === 'Build' ? 'Build' : sourceArea || 'available');
    console.log('Drag started from:', sourceArea);
  };

  const handleDrop = (
    event: React.DragEvent,
    targetArea: string,
    areaSetter: (updater: (prev: Meeple[]) => Meeple[]) => void
  ) => {
    event.preventDefault();
    const id = parseInt(event.dataTransfer.getData('meepleId'));
    const sourceArea = event.dataTransfer.getData('sourceArea');
  
    let draggedMeeple: Meeple | undefined;
  
    // Search all places for the meeple
    const findMeeple = () => {
      let found: Meeple | undefined =
        meeples.find(m => m.id === id) ||
        mainArea.find(m => m.id === id) ||
        Object.values(activeInvestments).flat().find(m => m.id === id);
      return found;
    };
  
    draggedMeeple = findMeeple();
    if (!draggedMeeple) return;
  
    // Remove from all areas to prevent duplication
    setMeeples(prev => prev.filter(m => m.id !== id));
    setMainArea(prev => prev.filter(m => m.id !== id));
    setActiveInvestments(prev => {
      const updated: typeof activeInvestments = {};
      for (const [key, value] of Object.entries(prev)) {
        updated[key] = value.filter(m => m.id !== id);
      }
      return updated;
    });
  
    // Add to target area
    if (targetArea === 'Build') {
      setMainArea(prev => [...prev, draggedMeeple!]);
    } else {
      const slots = Object.keys(activeInvestments);
      if (slots.includes(targetArea)) {
        setActiveInvestments(prev => {
          const newMeeples = [...prev[targetArea], draggedMeeple!];
  
          // If this is the first meeple in the investment, initialize turns
          if (newMeeples.length === 1) {
            const investmentConfig = investmentConfigs.find(config => config.name === targetArea)!;
            setTurnsRemaining(prev => ({
              ...prev,
              [targetArea]: investmentConfig.turnsToComplete
            }));
          }
  
          return {
            ...prev,
            [targetArea]: newMeeples
          };
        });
      }
    }
  };

  const allowDrop = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const MeeplePlaceholder = () => (
    <div style={{
      width: 50,
      height: 50,
      border: '2px dashed #666',
      borderRadius: '50%',
      opacity: 0.5,
      margin: '0.5rem'
    }} />
  );

  const MeepleWithValue = ({ meeple, onDragStart, isInvestment }: { 
    meeple: Meeple; 
    onDragStart: (e: React.DragEvent, m: Meeple) => void;
    isInvestment?: boolean;
  }) => (
    <div style={{ 
      position: 'relative', 
      width:50, 
      height: 50, 
      display: 'inline-block',
      margin: '0.2rem'
    }}>
      <img
        src={developerIcon}
        draggable
        onDragStart={(e) => onDragStart(e, meeple)}
        onDragEnd={(e) => {
          if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.opacity = '1';
          }
        }}
        style={{ 
          width: '100%', 
          height: '100%', 
          cursor: 'grab',
          filter: isInvestment ? 'grayscale(100%) brightness(70%)' : 'none',
          transition: 'filter 0.2s ease'
        }}
        alt={`Developer ${meeple.id}`}
      />
      <div style={{
        position: 'absolute',
        bottom: '0',
        right: '0',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        fontSize: '14px',
        padding: '2px 6px',
        borderRadius: '4px',
        fontWeight: 'bold'
      }}>
        {meeple.value}
      </div>
      {isInvestment && meeple.turnsRemaining !== undefined && (
        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
          backgroundColor: meeple.turnsRemaining === 0 ? 'rgba(40, 167, 69, 0.9)' : 'rgba(0,0,0,0.7)',
          color: 'white',
          fontSize: '12px',
          padding: '2px 4px',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          {meeple.turnsRemaining}
        </div>
      )}
    </div>
  );

  const applyMeepleBoost = (
    boostedMeeples: Meeple[],
    update: {
      meeples: Meeple[],
      mainArea: Meeple[],
      investments: { [key: string]: Meeple[] }
    }
  ) => {
    const boostedMap = new Map<number, Meeple>();
    for (const m of boostedMeeples) {
      boostedMap.set(m.id, { ...m, value: m.value + 1 });
    }
  
    const boostedArray = Array.from(boostedMap.values());
  
    setMeeples(
      boostedArray.filter(m => update.meeples.some(orig => orig.id === m.id))
    );
    setMainArea(
      boostedArray.filter(m => update.mainArea.some(orig => orig.id === m.id))
    );
    setActiveInvestments(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(name => {
        updated[name] = boostedArray.filter(m =>
          update.investments[name]?.some(orig => orig.id === m.id)
        );
      });
      return updated;
    });
  };

  const DropZone = ({ title, area, setArea, color, description, isBuildArea, maxMeeples, turnsToComplete }: {
    title: string;
    area: Meeple[];
    setArea: (updater: (prev: Meeple[]) => Meeple[]) => void;
    color: string;
    description?: string;
    isBuildArea?: boolean;
    maxMeeples?: number;
    turnsToComplete?: number;
  }) => {
    const investmentConfig = investmentConfigs.find(config => config.name === title);
    const isCompleted = !isBuildArea && completedInvestments.has(title);
    
    return (
      <div
        onDrop={(e) => !isCompleted && handleDrop(e, title, setArea)}
        onDragOver={allowDrop}
        style={{ 
          flex: 1, 
          minHeight: 150, 
          backgroundColor: isCompleted ? '#e0e0e0' : color, 
          padding: '1rem', 
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          opacity: isCompleted ? 0.6 : 1,
          transition: 'opacity 0.3s ease'
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%',
          marginBottom: '0.5rem'
        }}>
          <strong style={{ textAlign: 'center' }}>{title}</strong>
          {!isBuildArea && investmentConfig && (isCompleted || area.length === maxMeeples) && (
            <div style={{
              backgroundColor: isCompleted ? 'rgba(40, 167, 69, 0.9)' : 'rgba(30, 119, 235, 0.7)',
              color: 'white',
              fontSize: '14px',
              padding: '2px 8px',
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>
              {isCompleted ? '0 turns' : `${turnsRemaining[title] !== undefined ? turnsRemaining[title] : investmentConfig.turnsToComplete} turns`}
            </div>
          )}
        </div>
        {turnsToComplete && (
          <div style={{ 
            textAlign: 'center', 
            fontSize: '0.8rem', 
            color: '#666',
            marginBottom: '0.5rem'
          }}>
            Turns to complete: {turnsToComplete}
          </div>
        )}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: isBuildArea ? '200px' : '60px',
          flex: 1,
          alignContent: 'center'
        }}>
          {!isBuildArea && maxMeeples && Array(maxMeeples).fill(null).map((_, index) => (
            <div key={`placeholder-${title}-${index}`} style={{ position: 'relative' }}>
              {area[index] ? (
                <MeepleWithValue 
                  key={`${title}-${area[index].id}`}
                  meeple={area[index]} 
                  onDragStart={(e, m) => {
                    if (e.currentTarget instanceof HTMLElement) {
                      e.currentTarget.style.opacity = '0.5';
                    }
                    handleDragStart(e, m, title);
                  }}
                  isInvestment={true}
                />
              ) : (
                <MeeplePlaceholder />
              )}
            </div>
          ))}
          {isBuildArea && area.map((m) => (
            <MeepleWithValue 
              key={`Build-${m.id}`}
              meeple={m} 
              onDragStart={(e, m) => {
                if (e.currentTarget instanceof HTMLElement) {
                  e.currentTarget.style.opacity = '0.5';
                }
                handleDragStart(e, m, title);
              }} 
              isInvestment={false}
            />
          ))}
        </div>
        {description && (
          <div style={{ 
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#666',
            marginTop: 'auto',
            padding: '0.5rem',
            borderTop: '1px solid rgba(0,0,0,0.1)'
          }}>
            {description}
          </div>
        )}
      </div>
    );
  };

  const handleBeginTurn = () => {
    const updatedTurns = { ...turnsRemaining };
    const newlyCompleted = new Set<string>();
  
    investmentConfigs.forEach(config => {
      const area = activeInvestments[config.name];
      const title = config.name;
  
      if (completedInvestments.has(title)) return;
  
      if (area.length === config.maxMeeples) {
        if (updatedTurns[title] === undefined) {
          updatedTurns[title] = config.turnsToComplete - 1;
        } else {
          updatedTurns[title] = Math.max(0, updatedTurns[title]! - 1);
          if (updatedTurns[title] === 0) {
            newlyCompleted.add(title);
          }
        }
      } else {
        updatedTurns[title] = undefined;
      }
    });
  
    setTurnsRemaining(updatedTurns);
  
    // Update completed investments, apply boosts and reduce tech debt
    newlyCompleted.forEach(name => {
      const investment = investmentConfigs.find(i => i.name === name)!;
      const completedMeeples = activeInvestments[name];
  
      // Reduce tech debt
      const currentUnits = Math.ceil((techDebt * BASE_TECH_DEBT) / 100);
      const newUnits = Math.max(0, currentUnits - (investment.techDebtReduction ?? 0));
      setTechDebt((newUnits * 100) / BASE_TECH_DEBT);
  
      // Return meeples
      setMeeples(prev => uniqueMeeples([...prev, ...completedMeeples]));
      setActiveInvestments(prev => ({
        ...prev,
        [name]: []
      }));
  
      // Apply +1 value if needed
      if (investment.increaseValue) {
        const all = [...meeples, ...mainArea, ...Object.values(activeInvestments).flat(), ...completedMeeples];
        const boosted = new Map<number, Meeple>();
        for (const m of all) {
          boosted.set(m.id, { ...m, value: m.value + 1 });
        }
  
        const boostedList = Array.from(boosted.values());
  
        setMeeples(prev => boostedList.filter(b => prev.some(m => m.id === b.id)));
        setMainArea(prev => boostedList.filter(b => prev.some(m => m.id === b.id)));
        setActiveInvestments(prev => {
          const updated = { ...prev };
          for (const key in prev) {
            updated[key] = boostedList.filter(b => prev[key].some(m => m.id === b.id));
          }
          return updated;
        });
      }
  
      setCompletedInvestments(prev => new Set(prev).add(name));
    });
  
    // Update confidence
    let confidence = 10;
    if (completedInvestments.has('CI/CD')) confidence += 65;
    if (completedInvestments.has('Test Coverage')) confidence += 25;
    setConfidence(Math.min(confidence, 100));

    // Calculate value from mainArea
    let totalValue = 0;
    mainArea.forEach(m => {
      const roll = Math.floor(Math.random() * m.value) + 1;
      totalValue += roll;
    });

    if (completedInvestments.has('CI/CD')) {
      totalValue += mainArea.length;
    }

    const bugCount = Math.max(0, Math.floor((techDebt - 80) / 10));
    const netValue = totalValue - bugCount;
    setBugs(bugCount);
    setCumulativeValue(prev => prev + totalValue);

    // Release logic
    let delivered = sprintHistory.at(-1)?.delivered || 0;
    let released = false;

    if (netValue >= 15) {
      const roll = Math.floor(Math.random() * 100) + 1;
      if (roll <= confidence) {
        released = true;
        delivered += netValue;
      }
    }

    // Update sprint history
    setSprintHistory(prev => [
      ...prev,
      {
        sprintNumber: currentSprint + 1,
        techDebt,
        releaseConfidence: confidence,
        devOutput: totalValue,
        netValue,
        bugs: bugCount,
        delivered,
        released
      }
    ]);

    setCurrentSprint(prev => prev + 1);
    };

      const chartData = Array.from({ length: maxSprintCount }, (_, i) => {
        const sprint = sprintHistory.find(s => s.sprintNumber === i + 1);
        return {
          sprint: `Sprint ${i + 1}`,
          net: sprint?.netValue ?? null,
          delivered: sprint?.delivered ?? null,
          techDebt: sprint?.techDebt ?? null
        };
      });
  

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <h1 style={{ margin: 0, fontSize: '2.5rem', color: '#222' }}>Tech Debt Simulator</h1>
      <p style={{ fontSize: '1.25rem', color: '#666', marginTop: '0.5rem' }}>
        See what happens when you ignore it or pay it down.
      </p>
    </div>

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
          />
          
          {/* Game Parameters Box */}
          <div style={{ 
            backgroundColor: '#f8f9fa',
            padding: '1rem',
            borderRadius: 8,
            border: '1px solid #dee2e6',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <div><strong>Tech Debt:</strong> {techDebt}%</div>
            <div><strong>Release Confidence:</strong> {releaseConfidence}%</div>
            <div><strong>Value:</strong> {cumulativeValue}</div>
            <div><strong>Bugs:</strong> {bugs}</div>
          </div>

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
                    ? 'Allocate All Developers First'
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
            />
          ))}
        </div>
      </div>
      

      {/* Sprint Counter */}
      <div style={{ 
        textAlign: 'center', 
        fontSize: '1.5rem', 
        marginBottom: '1rem',
        fontWeight: 'bold',
        color: '#333'
      }}>
        Sprint {currentSprint} of 10
      </div>

      {/* Graph */}
      <div style={{ height: 300, marginBottom: '2rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sprint" />
            <YAxis domain={[0, 120]} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line type="linear" dataKey="net" stroke="#007bff" name="Net Value" connectNulls />
            <Line type="linear" dataKey="techDebt" stroke="#dc3545" name="Tech Debt (%)" connectNulls />
            <Line type="linear" dataKey="delivered" stroke="#28a745" name="Delivered Value" connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sprint History Table */}
      {sprintHistory.length > 0 && (
        <div style={{ 
          marginBottom: '2rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            backgroundColor: 'white'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>Sprint</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>Tech Debt</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>Release Confidence</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>Dev</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>Bugs</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>Net Output</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>Release</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid #dee2e6' }}>Value Delivered</th>
              </tr>
            </thead>
            <tbody>
              {sprintHistory.map((sprint, index) => (
                <tr key={index} style={{ 
                  borderBottom: index < sprintHistory.length - 1 ? '1px solid #dee2e6' : 'none'
                }}>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{sprint.sprintNumber}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{sprint.techDebt}%</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{sprint.releaseConfidence}%</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{sprint.devOutput}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{sprint.bugs}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{sprint.netValue}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{sprint.released ? '✅' : '❌'}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>{sprint.delivered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 