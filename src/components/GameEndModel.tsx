import React from 'react';
import { SprintData } from '../types';
import styles from '../styles/GameEndModal.module.css';

type GameEndModalProps = {
  isOpen: boolean;
  onClose: () => void;
  resultHistory: SprintData[];
  techDebt: number;
  valueDelivered: number;
};

export const GameEndModal: React.FC<GameEndModalProps> = ({
  isOpen,
  onClose,
  resultHistory,
  techDebt,
  valueDelivered,
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
          Final Tech Debt: <strong>{techDebt}</strong>
        </p>
        <p>
          Total Value Delivered: <strong>{valueDelivered}</strong>
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};