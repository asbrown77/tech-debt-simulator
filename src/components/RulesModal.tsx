import React from 'react';

type RulesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const RulesModal = ({ isOpen, onClose }: RulesModalProps) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>×</button>

        <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center' }}>Tech Debt Simulator</h1>
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#444' }}>
            See what happens when you ignore it or pay it down.
          </p>

          <h2>🎯 Your Goal</h2>
          <p>
            Deliver as much value as possible across <strong>10 sprints</strong>. But there’s a catch — your team starts with high technical debt.
          </p>

          <h2>🔨 Developers</h2>
          <ul>
            <li>You have 6 developers. Each starts with a value of <strong>5</strong>.</li>
            <li>Place developers in the <strong>Build area</strong> to begin working on the next feature.</li>
            <li>You can also assign developers to <strong>Investments</strong> that improve the team over time.</li>
            <li>In Build, a developer randomly generates output between <strong>1 and their current value</strong>.</li>
          </ul>

          <h2>🧪 Improvements</h2>
          <p>
            Not all investments are equal — some take more effort to complete but offer <strong>bigger long-term rewards</strong>.
          </p>
          <p>When completed, they provide permanent boosts:</p>
          <ul>
            <li><strong>CI/CD</strong>: +65% release confidence, +1 dev value</li>
            <li><strong>Test Coverage</strong>: +25% release confidence, +1 dev value</li>
            <li><strong>Code Quality</strong>: -1 tech debt, +1 dev value</li>
            <li><strong>Reduce Complexity</strong>: -3 tech debt</li>
          </ul>

          <h2>🔁 Sprints</h2>
          <ul>
            <li>Only developers in the Build area generate value.</li>
            <li>Bugs appear when tech debt is high, reducing your net output.</li>
            <li>Releases depend on your <strong>release confidence</strong>. The higher it is, the more likely you succeed.</li>
            <li>If the release fails, all value from that sprint is lost.</li>
          </ul>

          <h2>🚨 Tech Debt</h2>
          <ul>
            <li>Your team starts overloaded — tech debt is at <strong>100%</strong>.</li>
            <li>If left unchecked, it leads to bugs and failed deliveries.</li>
            <li>Investments help reduce it.</li>
          </ul>

          <h2>🏁 Game Over</h2>
          <p>
            After 10 sprints, review how your strategy played out. What would you change next time?
          </p>

          <p style={{ marginTop: '2rem', fontSize: '1rem', color: '#666' }}>
            Now… can you balance building features with investing in your future?
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <button
                onClick={onClose}
                style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#4dabf7',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                Let’s Begin
            </button>
          </div>
        </div>
        
      </div>
      
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '900px',
    maxHeight: '90%',
    overflowY: 'auto' as const,
    position: 'relative' as const,
    boxShadow: '0 0 30px rgba(0,0,0,0.2)',
  },
  closeButton: {
    position: 'absolute' as const,
    top: '10px',
    right: '15px',
    fontSize: '1.5rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: '#888',
  },
};
