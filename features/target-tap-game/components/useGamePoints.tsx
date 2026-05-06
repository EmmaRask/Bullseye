import { useState } from 'react';
import { POINTS_MAP } from './gameConstants';

export const useGamePoints = () => {
  const [totalPoints, setTotalPoints] = useState(0);

  const addPoints = (targetLabel: string) => {
    const points = POINTS_MAP[targetLabel] || 0;
    setTotalPoints((prev) => prev + points);
  };

  const resetPoints = () => {
    setTotalPoints(0);
  };

  return { totalPoints, addPoints, resetPoints };
};
