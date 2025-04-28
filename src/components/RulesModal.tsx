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
          <h1 style={{ textAlign: 'center' }}>Tech Debt Simulation</h1>
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#444' }}>
            See what happens when you ignore it or invest wisely.
          </p>
          <p style={{ textAlign: 'center', fontSize: '1rem', color: '#666', marginTop: '0.5rem' }}>
            A simple tool to explore how tech debt decisions shape delivery outcomes.
          </p>

          <h2>🎯 Your Goal</h2>
          <p>
            You have <strong>10 sprints</strong> to deliver as much value as possible. Sounds simple.
          </p>
          <p>
            But your team is stuck. They are buried in tech debt, unable to release reliably, and looking busy without results.
          </p>
          <p>
            What will you do next?
          </p>
          <ul>
            <li>How will you help them start delivering?</li>
            <li>What happens if you invest?</li>
            <li>What happens if you do nothing?</li>
          </ul>
          <p>
            Every decision is a trade off. What you invest in or ignore will shape how your team delivers.
          </p>

          <h2>👨‍💻 Your Developers</h2>
          <ul>
            <li>You have 6 devs. Each one starts with a <strong>power level of 5</strong>.</li>
            <li>
              When assigned to <strong>Build</strong>, they generate <strong>1 to 5 value</strong> each sprint.
            </li>
            <li>Double-click an area or drag and drop your devs to assign them.</li>
            <li>
              Drop them into <strong>Build</strong> to crank out features, or invest in the future by assigning them to <strong>Improvements</strong>.
            </li>
          </ul>

          <h2>⏰ Tech Debt Gets in the Way</h2>
          <ul>
            <li>You inherited <strong>100 percent tech debt</strong>. Lucky you.</li>
            <li>Ignore it, and it gets worse, with more bugs and failed releases.</li>
            <li>The only way out is to invest in improvements.</li>
          </ul>

          <h2>🧪 Team Improvements</h2>
          <p>Each investment you complete gives your team a permanent upgrade:</p>
          <ul>
            <li><strong>More dev power</strong>, generating more value each sprint.</li>
            <li><strong>Higher release confidence</strong>, better odds your work actually ships.</li>
            <li><strong>Less tech debt</strong>, meaning fewer bugs and faster progress.</li>
          </ul>

          <h2>📋 How the Simulation Works</h2>
          <ul>
            <li>Only devs in <strong>Build</strong> generate value each sprint.</li>
            <li><strong>Bugs</strong> are more likely with high tech debt for each developer building.</li>
            <li><strong>Releases</strong> depend on a roll from 1 to 100:
              <ul>
                <li>If the roll is less than or equal to your <strong>Release Confidence</strong>, the release succeeds.</li>
                <li>Otherwise, nothing is released that sprint.</li>
              </ul>
            </li>
            <li>Only released value counts. Failed release equals lost value.</li>
            <li>The simulation ends after 10 sprints. Reflect on your results and what you might change next time.</li>
          </ul>

          <p style={{ marginTop: '2rem', fontSize: '1rem', textAlign: 'center' }}>
            <strong>Deliver now or build a team that delivers sustainably. You decide.</strong>
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
