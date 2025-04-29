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
  const segments = Array.from({ length: 10 }, (_, i) => i); // 10 segments
  const [current, setCurrent] = useState<number | null>(null); // Current active segment
  const [localResult, setLocalResult] = useState<'success' | 'fail' | null>(null); // Spin result
  const [finalTarget, setFinalTarget] = useState<number | null>(null); // Final target segment
  const [spinning, setSpinning] = useState(false); // Track if the spinner is spinning

  // Reset result and spinner when resetSpinResultTrigger changes
  useEffect(() => {
    setLocalResult(null);
    setFinalTarget(null);
    setCurrent(null);
    setSpinning(false);
  }, [resetSpinResultTrigger]);

  useEffect(() => {
    if (triggerSpin) {
      setLocalResult(null); // Clear previous result
      setSpinning(true); // Start spinning

      let steps = 20 + Math.floor(Math.random() * segments.length); // Total steps for the spin
      let speed = 50; // Initial speed (ms between steps)

      const roll = Math.floor(Math.random() * 100) + 1; // Random roll (1-100)
      const success = roll <= confidence; // Determine success based on confidence

      const greenSegments = Math.floor((confidence / 100) * segments.length); // Number of success segments
      const targetIndexes = success
        ? segments.slice(0, greenSegments) // Success zones
        : segments.slice(greenSegments); // Fail zones

      const target =
        targetIndexes[Math.floor(Math.random() * targetIndexes.length)]; // Random target in success/fail zones
      setFinalTarget(target); // Save the final target

      const spin = () => {
        setCurrent((prev) => {
          const next = prev === null ? 0 : (prev + 1) % segments.length; // Move to the next segment
          return next;
        });

        if (steps > 0) {
          setTimeout(spin, speed); // Continue spinning
          steps--;

          if (steps < 10) {
            speed += 30; // Gradually slow down
          }
        } else {
          setSpinning(false); // Stop spinning
          setCurrent(target); // Land on the correct box
          setLocalResult(success ? 'success' : 'fail'); // Set result
          onSpinComplete(success); // Notify parent component
        }
      };

      spin(); // Start the spin
    }
  }, [triggerSpin, confidence, onSpinComplete]);

  const greenSegments = Math.floor((confidence / 100) * segments.length); // Calculate success segments

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
      {/* Spinner Row */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {segments.map((_, idx) => {
          const isGreen = idx < greenSegments; // Success segment
          const isActive = spinning ? idx === current : idx === finalTarget; // Highlight current during spin, finalTarget after spin

          return (
            <div
              key={idx}
              style={{
                width: '30px',
                height: '30px',
                margin: '0 4px',
                borderRadius: '4px',
                backgroundColor: isActive
                  ? '#4dabf7' // Active segment color
                  : isGreen
                  ? 'lightgreen' // Success segment color
                  : '#f8d7da', // Fail segment color
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                border: isActive ? '2px solid #333' : '1px solid #ccc', // Highlight active segment
                transition: 'background-color 0.2s',
              }}
            >
              {idx + 1}
            </div>
          );
        })}
      </div>

      {/* Result text */}
      {spinning !== true &&  (
        <div style={{ marginTop: '0.5rem', fontWeight: 'bold', fontSize: '1rem' }}>
          {localResult === 'success' ? '✅ Released!' : '❌ Failed!'}
        </div>
      )}
    </div>
  );
};