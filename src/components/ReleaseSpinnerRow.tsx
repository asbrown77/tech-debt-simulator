import React, { useState, useEffect } from 'react';

export const ReleaseSpinnerRow = ({
  releaseConfidence,
  triggerSpin,
  resetSpinnerTrigger,
  onSpinComplete,
  netValue: netValue,
}: {
  releaseConfidence: number;
  triggerSpin: boolean;
  resetSpinnerTrigger: number;
  onSpinComplete: (success: boolean) => void;
  netValue: number;
}) => {

  const segments = Array.from({ length: 10 }, (_, i) => i); // 10 segments
  const [current, setCurrent] = useState<number | null>(null); // Current active segment
  const [successful, setSuccessful] = useState<boolean | null>(null); // Spin result
  const [finalTarget, setFinalTarget] = useState<number | null>(null); // Final target segment
  const [spinning, setSpinning] = useState(false); // Track if the spinner is spinning

  // Reset result and spinner when resetTurnResultTrigger changes
  useEffect(() => {
    // setSuccessful(null);
    // setFinalTarget(null);
    // setCurrent(null);
    // setSpinning(false);
  }, [resetSpinnerTrigger]);

  useEffect(() => {
    if (triggerSpin) {
      setSuccessful(null); // Clear previous result
      setSpinning(true); // Start spinning

      let steps = 20 + Math.floor(Math.random() * segments.length); // Total steps for the spin
      let speed = 50; // Initial speed (ms between steps)

      const roll = Math.floor(Math.random() * 100) + 1; // Random roll (1-100)
      const success = roll <= releaseConfidence; // Determine success based on confidence

      const greenSegments = Math.floor((releaseConfidence / 100) * segments.length); // Number of success segments
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
          setSuccessful(success); // Set result
          onSpinComplete(success); // Notify parent component
        }
      };

      spin(); // Start the spin
    }
  }, [triggerSpin]);

  const greenSegments = Math.floor((releaseConfidence / 100) * segments.length); // Calculate success segments

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginTop: '1rem' }}>
      {/* Left Section */}
      <div style={{ flex: 1 }}>
        
        {/* Result Row */}
        <div style={{ display: 'flex', fontSize: '1.2rem', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <strong>Release Successful?</strong>
          </div>
          <div
            style={{
              fontWeight: 'bold',
              fontSize: '1.2rem',
              color: successful ? 'green' : 'red',
            }}
          >
            {successful == null ? '' : (successful ? '✅ Successful' : '❌ Failed')}
          </div>
        </div>

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
                {/* {idx + 1} */}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Section */}
      <div style={{ marginLeft: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>      
        <div
          style={{
            width: '120px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #ccc',
            borderRadius: '8px',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: successful ? 'green' : 'red',
            backgroundColor: '#fff', // White background
          }}
        >
          {successful ? netValue : 0}
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '0.5rem' }}>Value Delivered</div>
      </div>
    </div>
  );
};