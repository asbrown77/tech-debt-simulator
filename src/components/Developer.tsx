import React from 'react';
import developerIcon from '../developer.svg';
import { Developer } from '../types'; 

export type DeveloperWithValueProps = {
    developer: Developer;
    onDragStart: (e: React.DragEvent, m: Developer) => void;
    isInvestment?: boolean;
  };
  
  export const DeveloperWithValue = ({ developer, onDragStart, isInvestment }: DeveloperWithValueProps) => (
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
        onDragStart={(e) => onDragStart(e, developer)}
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
        alt={`Developer ${developer.id}`}
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
        {developer.value}
      </div>
      {isInvestment && developer.turnsRemaining !== undefined && (
        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
          backgroundColor: developer.turnsRemaining === 0 ? 'rgba(40, 167, 69, 0.9)' : 'rgba(0,0,0,0.7)',
          color: 'white',
          fontSize: '12px',
          padding: '2px 4px',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          {developer.turnsRemaining}
        </div>
      )}
    </div>
  );

  export const DeveloperPlaceholder = () => (
    <div style={{
      width: 50,
      height: 50,
      border: '2px dashed #666',
      borderRadius: '50%',
      opacity: 0.5,
      margin: '0.5rem'
    }} />
  );