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
            See what happens when you ignore it… or pay it down.
          </p>

          <h2>🎯 Your Goal</h2>
          <p>
            You’ve got <strong>10 sprints</strong> to deliver as much value as possible.
            Easy? Not quite.<br />
            You’ve inherited a team buried in tech debt and they can’t release working software every sprint.
          </p>

          <h2>👨‍💻 Your Developers</h2>
          <ul>
            <li>You’ve got 6 devs. Each one starts with a <strong>power level of 5</strong>.</li>
            <li>
              That means when they’re assigned to <strong>Build</strong>, they can generate <strong>1 to 5 value</strong> each sprint.
            </li>
            <li>Double-click an area or drag and drop your devs to assign them.</li>
            <li>
              Drop them into <strong>Build</strong> to crank out features, or invest in the future by assigning them to
              <strong>Investments</strong> like CI/CD or Test Coverage.
            </li>
          </ul>

          <h2>⏰ Tech Debt Gets in the Way</h2>
          <ul>
            <li>You inherited <strong>100% tech debt</strong>. Lucky you.</li>
            <li>Ignore it, and it gets worse - more bugs, more failed releases.</li>
            <li>The only way out? Invest in improvements.</li>
          </ul>

          <h2>🧪 Improvements</h2>
          <p>Each investment you complete gives your team a permanent upgrade:</p>
          <ul>
            <li><strong>More dev power</strong> - your devs generate more value each sprint</li>
            <li><strong>Higher release confidence</strong> - better odds your work actually ships</li>
            <li><strong>Less tech debt</strong> - fewer bugs, faster progress</li>
          </ul>

          <h2>📋 How the Game Works</h2>
          <ul>
            <li>Only devs in Build generate value.</li>
            <li>Bugs show up when tech debt’s high, they eat into your output.</li>
            <li>Releasing is a dice roll - more confidence means better odds.</li>
            <li>Value only counts if you release. Fail the release? You lose that sprint’s work.</li>
            <li>After 10 sprints, the game ends. Check your results. What would you change next time?</li>
          </ul>

        <p style={{ marginTop: '2rem', fontSize: '1rem', textAlign: 'center' }}>
          <strong>Deliver now or build a team that delivers forever? You decide.</strong>
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
