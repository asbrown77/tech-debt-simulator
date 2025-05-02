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
          A simple tool to explore how tech debt decisions shape delivery outcomes. See what happens when you ignore it or invest wisely.
          </p>

          <p>
            Welcome to the Tech Debt Simulator! This exercise lets you <strong>explore how technical debt impacts delivery</strong> and how different strategies shape long-term outcomes.
          </p>

          <h3>🎯 Purpose</h3>
          <ul>
            <li>What happens if you pay down tech debt or leave it untouched.</li>
            <li>How improving feedback loops, increasing release frequency, improving product quality, or focusing on value can each lead to different outcomes.</li>
            <li>What strategies you choose to strengthen the team and its long-term delivery ability.</li>
          </ul>

          <h3>💡 How It Works</h3>
          <ul>
            <li>
              <strong>Build:</strong> Assign developers here to generate sprint output. Each developer rolls for value and may introduce bugs (higher tech debt means more bugs).
            </li>
            <li>
              <strong>Investments:</strong> Assign developers to complete improvements like Test Coverage, CI/CD, or Code Quality. These reduce bugs, improve maintainability, and raise team capability, making future delivery faster and smoother.
            </li>
            <li>
              <strong>Tech Debt:</strong> The more debt you carry, the harder it gets to deliver clean, reliable releases. Bugs reduce your net value each sprint and slow progress. Paying down debt opens up maintainability and extensibility, helping you respond faster to change.
            </li>
            <li>
              <strong>Release Confidence & Spinner:</strong> After each sprint, the spinner shows whether your team successfully deploys the work. If confidence is low or quality is poor, deployments often fail, leading to rework and lost value. Investments like CI/CD improve your ability to release smoothly and avoid costly failures.
            </li>
          </ul>

          <h3>🔄 Sprint Flow</h3>
          <ol>
            <li>Assign developers to Sprint or to Investments.</li>
            <li>Click <strong>Next Sprint</strong>.</li>
            <li>Developers work, output is generated, bugs are applied.</li>
            <li>The release spinner runs, determining if you ship or fail.</li>
            <li>Sprint results are recorded.</li>
          </ol>

          <h3>🔍 Explore Strategies</h3>
          <p>
            This simulator is about <strong>experimenting</strong>, not winning. Try out:
          </p>
          <ul>
            <li>Investing early to improve feedback loops and delivery confidence.</li>
            <li>Holding off on improvements to maximize short-term value (and see the tradeoffs).</li>
            <li>Focusing on quality and maintainability to enable faster, safer delivery over time.</li>
          </ul>

          <p>
            See how each approach affects your ability to deliver consistent, valuable outcomes and what happens when tech debt builds up or is paid down.
          </p>

          <h2>🧪 Team Improvements</h2>
          <p>Each investment you complete gives your team a permanent upgrade:</p>
          <ul>
            <li><strong>More dev power</strong>, generating more value each sprint.</li>
            <li><strong>Higher release confidence</strong>, better odds your work actually ships.</li>
            <li><strong>Less tech debt</strong>, meaning fewer bugs and faster progress.</li>
          </ul>

          <h2>📋 How the Simulator Works</h2>
          <ul>
            <li>Only working devs in <strong>the Sprint</strong> will generate value.</li>
            <li><strong>Bugs</strong> are more likely with high tech debt for each developer building.</li>
            <li><strong>Releases</strong> depend on a roll from 1 to 100:
              <ul>
                <li>If the roll is less than or equal to your <strong>Release Confidence</strong>, the release succeeds.</li>
                <li>Otherwise, nothing is released that sprint.</li>
              </ul>
            </li>
            <li>Only released value counts. Failed release equals lost value.</li>
            <li>The simulator ends after 10 sprints. Reflect on your results and what you might change next time.</li>
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