import React from 'react';
import { IterationData } from '../types';
import { TechDebtBadge } from './TechDebtBadge';
import styles from '../styles/ResultHistoryTable.module.css';

type Props = {
  data: IterationData[];
};

export const ResultHistoryTable = ({ data }: Props) => {
  if (data.length === 0) return null;

  return (
<div className={styles.resultTableWrapper}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        backgroundColor: 'white'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={cellStyle}>Iteration</th>
            <th style={cellStyle}>Tech Debt</th>
            <th style={cellStyle}>Dev</th>
            <th style={cellStyle}>Bugs</th>
            <th style={cellStyle}>Iteration Output</th>
            <th style={cellStyle}>Released</th>
            <th style={cellStyle}>Value Delivered</th>
          </tr>
        </thead>
        <tbody>
          {data.map((iteration, index) => (
            <tr key={index} style={{ 
              borderBottom: index < data.length - 1 ? '1px solid #dee2e6' : 'none'
            }}>
              <td style={cellStyle}>{iteration.iterationNumber}</td>
              <td style={{ ...cellStyle, textAlign: 'center', verticalAlign: 'middle' }}>
                <TechDebtBadge value={iteration.techDebt} maxValue={50} />
              </td>
              <td style={cellStyle}>{iteration.devValue}</td>
              <td style={cellStyle}>{iteration.bugs}</td>
              <td style={cellStyle}><strong>{iteration.netValue}</strong></td>
              <td style={cellStyle}>{iteration.released ? '✅' : '❌'}</td>
              <td style={cellStyle}><strong>{iteration.accumulatedValueDelivered}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const cellStyle: React.CSSProperties = {
  padding: '0.5rem',
  textAlign: 'center',
  borderBottom: '1px solid #dee2e6'
};
