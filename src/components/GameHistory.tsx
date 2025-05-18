import React, { useState, useEffect } from 'react';
import { IterationData } from '../types';
import { getTechDebtLetter, getTechDebtColor } from '../utils/helpers';
import styles from '../styles/GameHistory.module.css';

type GameSession = {
  name: string;
  timestamp: number;
  resultHistory: IterationData[];
};

type GameHistoryProps = {
  onLoadGame: (history: IterationData[], name: string) => void;
  refreshTrigger: number;
};

export const GameHistory = ({ onLoadGame, refreshTrigger }: GameHistoryProps) => {
  const [games, setGames] = useState<GameSession[]>([]);

    useEffect(() => {
    const stored = localStorage.getItem('gameSessions');
    if (stored) {
        setGames(JSON.parse(stored));
    }
    }, [refreshTrigger]);

  return (
    <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Game History</h2>
        {games.length > 0 && (
            <button
            className={styles.clearHistoryButton}
            title="Clear all saved games from history"
            onClick={() => {
                if (window.confirm('Are you sure you want to clear all saved game history?')) {
                localStorage.removeItem('gameSessions');
                setGames([]);
                }
            }}
            >

            Clear History
            </button>
        )}
        </div>

      {games.length === 0 ? (
        <p>No games played yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }} >
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '8px', textAlign: 'left', border: '0px solid #ccc', }}>Game Name</th>
              <th style={{ padding: '8px', textAlign: 'center', whiteSpace: 'nowrap', border: '0px solid #ccc', width:'15%'}}>Tech Debt</th>
              <th style={{ padding: '8px', textAlign: 'center', whiteSpace: 'nowrap', border: '0px solid #ccc', width:'15%'}}>Value</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '0px solid #ccc', width:'20%'}}>Date</th>
              <th style={{ padding: '8px', textAlign: 'center', whiteSpace: 'nowrap' , border: '0px solid #ccc', width:'12ch'}}></th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, index) => {
              const totalDelivered = game.resultHistory.reduce(
                (sum, i) => sum + (i.released ? i.netValue : 0),
                0
              );

              return (
                <tr key={index} style={{ borderTop: '1px solid #ccc' }}>
                  <td style={{ padding: '8px', textAlign: 'left' }}>{game.name}</td>
                  <td style={{ padding: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {(() => {
                        const debt = game.resultHistory.at(-1)?.techDebt ?? 0;
                        const letter = getTechDebtLetter(debt, 50);
                        const color = getTechDebtColor(debt, 50);
                        return (
                        <span
                            style={{
                            display: 'inline-block',
                            backgroundColor: color,
                            color: '#fff',
                            padding: '2px 10px',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            }}
                        >
                            {letter}
                        </span>
                        );
                    })()}
                  </td>

                  <td style={{ padding: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>{totalDelivered}</td>
                  <td style={{ padding: '8px', textAlign: 'center',  }}>
                    {new Date(game.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <button className={styles.viewButton} onClick={() => onLoadGame(game.resultHistory, game.name)}>View</button>             
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
