// src/config/gameMessages.ts

import React from 'react';

export const gameMessages: Record<number, React.ReactNode> = {
  10: (
    <>
      <h2>Welcome!</h2>
      <p>
       You’ve joined a team burdened by technical debt and struggling to deliver. Can you help turn things around? Explore how tackling (or ignoring) tech debt shapes delivery outcomes.
      </p>
      <p>
      👉🏻  Will you ignore the tech debt and keep pushing features? <br/>
      👉🏻  What happens if you focus on paying it down?<br/>
      👉🏻  How will different strategies change the outcome?
      </p>
    </>
  ),
  18: (
    <>
      <h2>Time is Running Out!</h2>
      <p>
        Only a few sprints left. 
      </p>
      <p>
      👉🏻  Have your investments paid off?<br/>
      👉🏻  How much value have you actually delivered?<br/>
      👉🏻  Should you adjust your approach in the final sprints?
      </p>
    </>
  ),
};
