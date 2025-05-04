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
          <p>
            Welcome to the <strong>Tech Debt Simulator!</strong> 
          </p>
          <p>
          A simple tool to explore how ignoring or paying down tech debt shapes delivery outcomes.
          </p>
          <p>
          <strong>Your goal</strong>: deliver as much value as possible over 20 sprints. Assign developers to build features or invest in improvements like CI/CD, test coverage, or reducing complexity.
          </p>

          <p>
            Watch how tech debt impacts bugs, delivery speed, and your team’s long-term success.
          </p>

          <p>
          👨🏻‍💻 Assign developers to the Sprint to generate output (but risk bugs).<br/>
          🔧 Assign developers to investments to reduce tech debt, improve quality, or boost release confidence.<br/>
          🎲 After each sprint, roll the spinner - if you pass, your work ships; if not, value is lost.<br/>
          </p>

          <p>
            Every improvement you complete gives your team a permanent upgrade:
          </p>

          <p>
          💪 More dev power → generate more value each sprint. <br/>
          🚀 Higher release confidence → better odds your work is released.<br/>
          🧹 Less tech debt → fewer bugs 🐞 <br/>
          </p>
          <p>
            Releases depend on a roll between 1-100. If you roll equal to or under your release confidence, the sprint’s value is delivered; otherwise, it’s lost.
          </p>

          <p>
            Only delivered value counts! The simulator ends after 20 sprints - reflect on what strategies worked and what you might change next time.
          </p>

          <p style={{ marginTop: '1rem' }}>
            This isn’t about winning - it’s about experimenting. Try investing early, delaying improvements, or balancing delivery and debt, and see how your choices shape the outcome.
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
