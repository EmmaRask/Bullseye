import { useState, useCallback } from 'react';
import { POINTS_MAP } from "../game/config";

export const useGamePoints = (initialScore: number = 0) => {
  const [totalPoints, setTotalPoints] = useState(initialScore);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const addPoints = useCallback((targetLabel: string) => {
    const points = POINTS_MAP[targetLabel] || 0;
    if (points > 0) {
      setIsHighlighted(true);
      setTimeout(() => setIsHighlighted(false), 100);
    }
    setTotalPoints((prev) => prev + points);
  }, []);

  const resetPoints = () => {
    setTotalPoints(0);
    setIsHighlighted(false);
  };

  return { totalPoints, addPoints, resetPoints, isHighlighted };
};
