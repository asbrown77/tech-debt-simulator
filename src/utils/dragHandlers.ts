import { Meeple } from '../types';
import { Dispatch, SetStateAction } from 'react';

export const handleDragStart = (
  event: React.DragEvent,
  meeple: Meeple,
  sourceArea?: string
) => {
  event.dataTransfer.setData('meepleId', meeple.id.toString());
  event.dataTransfer.setData('sourceArea', sourceArea === 'Build' ? 'Build' : sourceArea || 'available');
  console.log('Drag started from:', sourceArea);
};

export const allowDrop = (event: React.DragEvent) => {
  event.preventDefault();
};

export const handleDrop = (
  event: React.DragEvent,
  targetArea: string,
  areaSetter: (updater: (prev: Meeple[]) => Meeple[]) => void,
  meeples: Meeple[],
  mainArea: Meeple[],
  activeInvestments: { [key: string]: Meeple[] },
  setMeeples: Dispatch<SetStateAction<Meeple[]>>,
  setMainArea: Dispatch<SetStateAction<Meeple[]>>,
  setActiveInvestments: Dispatch<SetStateAction<{ [key: string]: Meeple[] }>>,
  setTurnsRemaining: Dispatch<SetStateAction<{ [key: string]: number | undefined }>>,
  investmentConfigs: any[]
) => {
  event.preventDefault();
  const id = parseInt(event.dataTransfer.getData('meepleId'));
  const sourceArea = event.dataTransfer.getData('sourceArea');

  let draggedMeeple: Meeple | undefined =
    meeples.find(m => m.id === id) ||
    mainArea.find(m => m.id === id) ||
    Object.values(activeInvestments).flat().find(m => m.id === id);

  if (!draggedMeeple) return;

  // Remove from all areas
  setMeeples(prev => prev.filter(m => m.id !== id));
  setMainArea(prev => prev.filter(m => m.id !== id));
  setActiveInvestments(prev => {
    const updated: typeof activeInvestments = {};
    for (const [key, value] of Object.entries(prev)) {
      updated[key] = value.filter(m => m.id !== id);
    }
    return updated;
  });

  // Add to target
  if (targetArea === 'Build') {
    setMainArea(prev => [...prev, draggedMeeple!]);
  } else {
    const slots = Object.keys(activeInvestments);
    if (slots.includes(targetArea)) {
      setActiveInvestments(prev => {
        const newMeeples = [...prev[targetArea], draggedMeeple!];
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
