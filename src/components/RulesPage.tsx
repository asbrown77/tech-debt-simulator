import React from 'react';

export const RulesPage = () => {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Tech Debt Simulator</h1>
      <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#444' }}>
        Go slower to go faster.
      </p>

      <h2>🎯 Your Goal</h2>
      <p>Deliver as much value as possible across <strong>10 sprints</strong>. But beware — technical debt slows you down.</p>

      <h2>🔨 Developers</h2>
      <ul>
        <li>You have 6 developers (Meeples), each with a value (1–5).</li>
        <li>Drag developers to the <strong>Build area</strong> to generate value.</li>
        <li>Or assign them to <strong>Investments</strong> that improve your team over time.</li>
      </ul>

      <h2>🧪 Improvements</h2>
      <p>Each investment takes a few turns. When completed, they give boosts:</p>
      <ul>
        <li><strong>CI/CD</strong>: +65% release confidence, +1 dev value</li>
        <li><strong>Test Coverage</strong>: +25% release confidence, +1 dev value</li>
        <li><strong>Code Quality</strong>: -1 tech debt, +1 dev value</li>
        <li><strong>Reduce Complexity</strong>: -3 tech debt</li>
      </ul>

      <h2>🔁 Sprints</h2>
      <ul>
        <li>Developers in Build generate random value based on their score.</li>
        <li>Bugs appear if tech debt is too high (bugs reduce value).</li>
        <li>Release is based on your <strong>release confidence</strong>.</li>
        <li>If released, value is delivered. If not, it’s lost.</li>
      </ul>

      <h2>🚨 Tech Debt</h2>
      <ul>
        <li>Starts at 100% and must be reduced to avoid bugs and delivery failures.</li>
        <li>High tech debt = more bugs and slower progress.</li>
      </ul>

      <h2>🏁 Game Over</h2>
      <p>After 10 sprints, you’ll see your final results:</p>
      <ul>
        <li><strong>Total Value Delivered</strong></li>
        <li><strong>Remaining Tech Debt</strong></li>
        <li><strong>Confidence Built</strong></li>
      </ul>

      <p style={{ marginTop: '2rem', fontSize: '1rem', color: '#666' }}>
        Now… can you balance building features with investing in your future?
      </p>
    </div>
  );
};
