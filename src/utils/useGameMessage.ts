

import { useState } from 'react';
import React from 'react';

export function useGameMessage() {
  const [gameMessage, setGameMessage] = useState<{ isOpen: boolean; content: React.ReactNode }>({
    isOpen: false,
    content: null,
  });

  return { gameMessage, setGameMessage };
}