'use client';

import { gameSession, type GameStatus } from '@/game/gameSession';
import { useState, useEffect } from 'react';

export function useGameSession() {
  const [status, setStatus] = useState<GameStatus>('not_started');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setStatus(gameSession.getStatus());
  }, []);

  return {
    status: isClient ? status : 'not_started',
    startGame: () => {
      gameSession.startGame();
      setStatus('playing');
    },
    finishGame: () => {
      gameSession.finishGame();
      setStatus('finished');
    },
    reset: () => {
      gameSession.reset();
      setStatus('not_started');
    },
    setTransaction: (id: string) => {
      gameSession.setTransaction(id);
      setStatus('playing');
    },
  };
}
