import React, { useState } from 'react';

interface ReleaseWheelProps {
  confidence: number; // Confidence as a percentage
}

export const ReleaseWheel: React.FC<ReleaseWheelProps> = ({ confidence }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<'success' | 'fail' | null>(null);

  const handleSpin = () => {
    setSpinning(true);
    setResult(null);

    const fullSpins = 5; // Full spins before stopping
    const randomSlice = Math.floor(Math.random() * 10);
    const sliceDegree = 360 / 10;
    const targetRotation = fullSpins * 360 + randomSlice * sliceDegree;

    setRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      const successSlices = Math.round((confidence / 100) * 10);
      setResult(randomSlice < successSlices ? 'success' : 'fail');
    }, 3000);
  };

  const wheelStyle: React.CSSProperties = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '5px solid #ccc',
    position: 'relative',
    transform: `rotate(${rotation}deg)` ,
    transition: spinning ? 'transform 3s ease-out' : 'none',
    margin: '0 auto',
  };

  const generateSlices = () => {
    const slices = [];
    for (let i = 0; i < 10; i++) {
      const isSuccess = i < Math.round((confidence / 100) * 10);
      const rotation = i * 36;
      slices.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            width: '50%',
            height: '50%',
            backgroundColor: isSuccess ? 'green' : 'red',
            transform: `rotate(${rotation}deg) skewY(-54deg)`,
            transformOrigin: '0% 100%',
          }}
        />
      );
    }
    return slices;
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        <div style={wheelStyle}>{generateSlices()}</div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -100%)',
          width: '0',
          height: '0',
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderBottom: '12px solid black',
        }} />
      </div>

      <button onClick={handleSpin} disabled={spinning} style={{ marginTop: '1rem' }}>
        Spin for Release
      </button>

      {result && (
        <div style={{ marginTop: '1rem', fontWeight: 'bold', color: result === 'success' ? 'green' : 'red' }}>
          {result === 'success' ? '✅ Released!' : '❌ Failed!'}
        </div>
      )}
    </div>
  );
};
