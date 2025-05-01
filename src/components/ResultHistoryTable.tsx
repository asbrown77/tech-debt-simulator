import React from 'react';
import { SprintData } from '../types';
import { TechDebtBadge } from './TechDebtBadge';

type Props = {
  data: SprintData[];
};

export const ResultHistoryTable = ({ data }: Props) => {
  if (data.length === 0) return null;

  return (
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
            <th style={cellStyle}>Sprint</th>
            <th style={cellStyle}>Tech Debt</th>
            <th style={cellStyle}>Release Confidence</th>
            <th style={cellStyle}>Dev</th>
            <th style={cellStyle}>Bugs</th>
            <th style={cellStyle}>Net Output</th>
            <th style={cellStyle}>Release</th>
            <th style={cellStyle}>Value Delivered</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sprint, index) => (
            <tr key={index} style={{ 
              borderBottom: index < data.length - 1 ? '1px solid #dee2e6' : 'none'
            }}>
              <td style={cellStyle}>{sprint.sprintNumber}</td>
              <td style={{ ...cellStyle, textAlign: 'center', verticalAlign: 'middle' }}>
  <TechDebtBadge value={sprint.techDebt} maxValue={50} />
</td>
              <td style={cellStyle}>{sprint.releaseConfidence}%</td>
              <td style={cellStyle}>{sprint.devValue}</td>
              <td style={cellStyle}>{sprint.bugs}</td>
              <td style={cellStyle}>{sprint.netValue}</td>
              <td style={cellStyle}>{sprint.released ? '✅' : '❌'}</td>
              <td style={cellStyle}>{sprint.accumulatedValueDelivered}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const cellStyle: React.CSSProperties = {
  padding: '0.75rem',
  textAlign: 'center',
  borderBottom: '1px solid #dee2e6'
};
