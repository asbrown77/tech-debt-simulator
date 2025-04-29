import { Developer, ActiveInvestments } from '../types';
import { Dispatch, SetStateAction } from 'react';

export const handleDragStart = (
  event: React.DragEvent,
  developer: Developer,
  sourceArea?: string
) => {
  event.dataTransfer.setData('developerId', developer.id.toString());
  event.dataTransfer.setData('sourceArea', sourceArea === 'Build' ? 'Build' : sourceArea || 'available');
  console.log('Drag started from:', sourceArea);
};

export const allowDrop = (event: React.DragEvent) => {
  event.preventDefault();
};

export const handleDrop = (
  event: React.DragEvent,
  targetArea: string,
  areaSetter: (updater: (prev: Developer[]) => Developer[]) => void,
  developers: Developer[],
  mainArea: Developer[],
  activeInvestments: ActiveInvestments,
  setDevelopers: Dispatch<SetStateAction<Developer[]>>,
  setMainArea: Dispatch<SetStateAction<Developer[]>>,
  setActiveInvestments: Dispatch<SetStateAction<ActiveInvestments>>,
  setTurnsRemaining: Dispatch<SetStateAction<{ [key: string]: number | undefined }>>,
  investmentConfigs: any[]
) => {
  event.preventDefault();
  const id = parseInt(event.dataTransfer.getData('developerId'));
  const sourceArea = event.dataTransfer.getData('sourceArea');

  let draggedDeveloper: Developer | undefined =
    developers.find(m => m.id === id) ||
    mainArea.find(m => m.id === id) ||
    Object.values(activeInvestments).flat().find(m => m.id === id);

  if (!draggedDeveloper) return;

  // Remove from all areas
  setDevelopers(prev => prev.filter(m => m.id !== id));
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
    setMainArea(prev => [...prev, draggedDeveloper!]);
  } else {
    const slots = Object.keys(activeInvestments);
    if (slots.includes(targetArea)) {
      setActiveInvestments(prev => {
        const newDevelopers = [...prev[targetArea], draggedDeveloper!];
        if (newDevelopers.length === 1) {
          const investmentConfig = investmentConfigs.find(config => config.name === targetArea)!;
          setTurnsRemaining(prev => ({
            ...prev,
            [targetArea]: investmentConfig.turnsToComplete
          }));
        }
        return {
          ...prev,
          [targetArea]: newDevelopers
        };
      });
    }
  }
};
