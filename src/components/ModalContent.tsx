
import { ModalContent, SprintData } from '../types';
import { TechDebtBadge } from './TechDebtBadge';

export const rulesModalContent: ModalContent = {
  body: (
    <>
    <p>
            Welcome to the <strong>Tech Debt Simulator!</strong> 
          </p>
          <p>
          A simple tool to explore how ignoring or paying down tech debt shapes delivery outcomes.
          </p>
          <p>
          <strong>Your goal</strong>: deliver as much value as possible over 20 iterations. Assign developers to build features or invest in improvements like Continuous Delivery, test coverage, or reducing complexity.
          </p>

          <p>
            Watch how tech debt impacts bugs, delivery speed, and your team’s long-term success.
          </p>

          <p>
          👨🏻‍💻 Assign developers to the Iteration to generate output (but risk bugs).<br/>
          🔧 Assign developers to investments to reduce tech debt, improve quality, or boost release probability.<br/>
          🎲 After each iteration, roll the spinner - if you pass, your work ships; if not, value is lost.<br/>
          </p>

          <p>
            Every improvement you complete gives your team a permanent upgrade:
          </p>

          <p>
          💪 More dev power → generate more value each iteration. <br/>
          🚀 Higher release probability → better odds your work is released.<br/>
          🧹 Less tech debt → fewer bugs 🐞 <br/>
          </p>
          <p>
            Releases depend on a roll between 1-100. If you roll equal to or under your release probability rate, the iteration's value is delivered; otherwise, it’s lost.
          </p>

          <p>
            Only delivered value counts! The simulator ends after 20 iterations - reflect on what strategies worked and what you might change next time.
          </p>

          <p style={{ marginTop: '1rem' }}>
            This isn’t about winning - it’s about experimenting. Try investing early, delaying improvements, or balancing delivery and debt, and see how your choices shape the outcome.
          </p>
    </>
  )
};


export const gameEndModalContent = (resultHistory: SprintData[], techDebt: number): ModalContent => ({
  body: (
    <>
      <h2>Congratulations! You completed last Iteration {[...resultHistory].reverse().find((x: SprintData) => x)?.sprintNumber}.</h2>

        <p>
          Review how your team performed. What happened to your tech debt? Look at the graph and history. 
          What did you notice about your strategy? How did the actual value delivered compare to your expectations?
        </p>
        <p>
          Final Tech Debt:  
          <span>  <TechDebtBadge value={techDebt} maxValue={50} /></span>
        </p>
        <p>
          Total Value Delivered: <strong>{[...resultHistory].reverse().find((item: SprintData) => item)?.accumulatedValueDelivered || 0}</strong>

        </p>
    </>
  )
});