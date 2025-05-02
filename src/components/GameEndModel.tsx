import React from 'react';
import { SprintData } from '../types';
import styles from '../styles/GameEndModal.module.css';
import { TechDebtBadge } from './TechDebtBadge';

type GameEndModalProps = {
  isOpen: boolean;
  onClose: () => void;
  resultHistory: SprintData[];
  techDebt: number;
};

export const GameEndModal: React.FC<GameEndModalProps> = ({
  isOpen,
  onClose,
  resultHistory,
  techDebt
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Congratulations! You completed Sprint 20!</h2>
        <p>
          Review how your team performed. What happened to your tech debt? Look at the graph and history. 
          What did you notice about your strategy? How did the actual value delivered compare to your expectations?
        </p>
        <p>
          Final Tech Debt: 
            <span>      <TechDebtBadge value={techDebt} maxValue={50} />
      </span>
        </p>
        <p>
          Total Value Delivered: <strong>{resultHistory.findLast(item => item)?.accumulatedValueDelivered || 0}</strong>
        </p>
      </div>
    </div>
  );
};