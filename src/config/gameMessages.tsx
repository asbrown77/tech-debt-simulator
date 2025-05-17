// src/config/gameMessages.ts

import React from 'react';

export const gameMessages: Record<number, React.ReactNode> = {
  10: (
    <>
      <h2>🚩 Welcome! </h2>
      <p>
       You’ve joined a team at Iteration 10, burdened by technical debt and struggling to deliver. 
       </p>
      <p>
        Take a moment to review the history: how quickly did tech debt build up? What value have they actually delivered in the last 10 iterations?
      </p>
      <p>
        You face a choice: push forward and ignore the debt, or invest in paying it down. 
      </p>
      <p>
        Tip: Different strategies lead to very different outcomes. What path will you choose?
      </p>
    </>
  ),
  15: (
    <>
      <h2>⏳ Iteration 15 - Final Stretch!</h2>
      <p>
        Just a few iterations left. Take a moment to reflect.
      </p>
      <p>
        So far, how much value has your team really delivered? <br/>
        Have your early investments started paying off, or is tech debt still holding you back?
      </p>
      <p>
        Tip: Focus your last iterations on what brings the biggest impact. It’s not too late to turn the game around!
      </p>
      </>
  ),
};
