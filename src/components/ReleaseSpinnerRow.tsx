import React, { useState, useEffect } from 'react';

export const ReleaseSpinnerRow = ({
  confidence,
  triggerSpin,
  resetSpinResultTrigger,
  onSpinComplete,
}: {
  confidence: number;
  triggerSpin: boolean;
  resetSpinResultTrigger: number;
  onSpinComplete: (success: boolean) => void;
}) => {
  const segments = Array.from({ length: 10 }, (_, i) => i);
  const [current, setCurrent] = useState<number | null>(null);
  const [localResult, setLocalResult] = useState<'success' | 'fail' | null>(null);

  // Reset result and spinner when resetSpinResultTrigger changes
  useEffect(() => {
    setLocalResult(null);
    setCurrent(null);
  }, [resetSpinResultTrigger]);

  useEffect(() => {
    if (triggerSpin) {
      setLocalResult(null);

      let steps = 20 + Math.floor(Math.random() * segments.length);
      let speed = 50;

      const roll = Math.floor(Math.random() * 100) + 1;
      const success = roll <= confidence;

      const greenSegments = Math.floor((confidence / 100) * segments.length);

      const targetIndexes = success
        ? segments.slice(0, greenSegments) // success zones
        : segments.slice(greenSegments);   // fail zones

      const finalTarget =
        targetIndexes[Math.floor(Math.random() * targetIndexes.length)];

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
          setCurrent(finalTarget); // Land on the correct box
          setLocalResult(success ? 'success' : 'fail');
          onSpinComplete(success);
        }
      };

      spin();
    } else {
      setCurrent(null);
    }
  }, [triggerSpin, confidence, onSpinComplete]);

  const greenSegments = Math.floor((confidence / 100) * segments.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
      {/* Spinner Row */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {segments.map((_, idx) => {
          const isGreen = idx < greenSegments;
          const isActive = idx === current || (localResult !== null && idx === current);

          return (
            <div
              key={idx}
              style={{
                width: '30px',
                height: '30px',
                margin: '0 4px',
                borderRadius: '4px',
                backgroundColor: isActive
                  ? '#4dabf7'
                  : isGreen
                  ? 'lightgreen'
                  : '#f8d7da',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                border: isActive ? '2px solid #333' : '1px solid #ccc',
                transition: 'background-color 0.2s',
              }}
            >
              {idx + 1}
            </div>
          );
        })}
      </div>

      {/* Result text */}
      {localResult !== null && (
        <div style={{ marginTop: '0.5rem', fontWeight: 'bold', fontSize: '1rem' }}>
          {localResult === 'success' ? '✅ Released!' : '❌ Failed!'}
        </div>
      )}
    </div>
  );
};
