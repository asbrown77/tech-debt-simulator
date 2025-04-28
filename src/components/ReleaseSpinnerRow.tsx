import React, { useState, useEffect } from 'react';

export const ReleaseSpinnerRow = ({
  confidence,
  triggerSpin,
  onSpinComplete,
}: {
  confidence: number;
  triggerSpin: boolean;
  onSpinComplete: (success: boolean) => void;
}) => {
  const [segments] = useState(Array.from({ length: 10 }, (_, i) => i));
  const [current, setCurrent] = useState<number | null>(null);
  const [localResult, setLocalResult] = useState<'success' | 'fail' | null>(null);

  useEffect(() => {
    if (triggerSpin) {
      let steps = 20 + Math.floor(Math.random() * segments.length);
      let speed = 50;

      const roll = Math.floor(Math.random() * 100) + 1;
      const success = roll <= confidence;

      const spin = () => {
        setCurrent(prev => {
          const next = prev === null ? 0 : (prev + 1) % segments.length;
          return next;
        });

        if (steps > 0) {
          setTimeout(spin, speed);
          steps--;

          if (steps < 10) {
            speed += 30;
          }
        } else {
          setLocalResult(success ? 'success' : 'fail');
          onSpinComplete(success);
        }
      };

      spin();
    }
  }, [triggerSpin, confidence, onSpinComplete]);

  const greenSegments = Math.floor((confidence / 100) * segments.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
      {/* Row of boxes */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {segments.map((_, idx) => {
          const isGreen = idx < greenSegments;

          return (
            <div
              key={idx}
              style={{
                width: '30px',
                height: '30px',
                margin: '0 4px',
                borderRadius: '4px',
                backgroundColor: idx === current ? '#4dabf7' : isGreen ? 'lightgreen' : '#f8d7da',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                border: idx === current ? '2px solid #333' : '1px solid #ccc',
                transition: 'background-color 0.2s',
              }}
            >
              {(idx + 1)*10}
            </div>
          );
        })}
      </div>

      {/* Text below the row */}
      {localResult && (
        <div style={{ marginTop: '0.5rem', fontWeight: 'bold', fontSize: '1rem' }}>
          {localResult === 'success' ? '✅ Released!' : '❌ Failed!'}
        </div>
      )}
    </div>
  );
};
