'use client';

import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { CIRCLE_SIZE, CONTAINER_WIDTH, CONTAINER_HEIGHT, BORDER_WIDTH, GAME_DURATION, LOSE_LIMIT, WIN_LIMIT } from './gameConstants';
import { targetRandomizer } from './targetRandomizer';
import { useCirclePhysics } from './useCirclePhysics';
import { useShootingLogic } from './useShootingLogic';
import { useGamePoints } from './useGamePoints';
=======
import { CIRCLE_SIZE, CONTAINER_WIDTH, CONTAINER_HEIGHT, BORDER_WIDTH } from '../../../game/config';
import { targetRandomizer } from '../../../game/targetRandomizer';
import { useCirclePhysics } from '../../../hooks/useCirclePhysics';
import { useShootingLogic } from '../../../hooks/useShootingLogic';
>>>>>>> 959f8d7ea8e4c6f308c8573c7490ca08731169c7

export default function GameScreen() {
  const [targets, setTargets] = useState<Array<{ size: number; label: string; x: number; y: number }>>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionResult, setSessionResult] = useState<'lose' | 'replay' | 'win' | null>(null);
  const { circleX, circleY } = useCirclePhysics();
  const { totalPoints, addPoints } = useGamePoints();
  const { result, resultColor, shots, handleClick } = useShootingLogic(targets, addPoints);

  // Initialize targets on mount
  useEffect(() => {
    setTargets(targetRandomizer());
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          setSessionScore(totalPoints);
          
          // Determine session result based on score
          if (totalPoints < LOSE_LIMIT) {
            setSessionResult('lose');
          } else if (totalPoints >= WIN_LIMIT) {
            setSessionResult('win');
          } else {
            setSessionResult('replay');
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver, totalPoints]);

  const handleGameClick = () => {
    if (gameOver) return;
    handleClick(circleX, circleY);
  };

  return (
    <div>
      <div
        onClick={handleGameClick}
        style={{
          position: 'relative',
          width: `${CONTAINER_WIDTH}px`,
          height: `${CONTAINER_HEIGHT}px`,
          border: `${BORDER_WIDTH}px solid black`,
        }}
      >
        {/* Targets */}
        {targets.map((target) => (
          <div
            key={target.label}
            style={{
              position: 'absolute',
              left: `${target.x}px`,
              top: `${target.y}px`,
              width: `${target.size}px`,
              height: `${target.size}px`,
              background: 'red',
              borderRadius: '50%',
            }}
          />
        ))}

        {/* Shot markers */}
        {shots.map((shot, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${shot.x - 3}px`,
              top: `${shot.y - 3}px`,
              width: '6px',
              height: '6px',
              background: 'black',
              borderRadius: '50%',
            }}
          />
        ))}

        {/* Moving blue circle */}
        <div
          style={{
            position: 'absolute',
            left: `${circleX}px`,
            top: `${circleY}px`,
            width: `${CIRCLE_SIZE}px`,
            height: `${CIRCLE_SIZE}px`,
            border: '2px solid blue',
            borderRadius: '50%',
          }}
        />
      </div>

      <h2 style={{ textAlign: 'center', color: resultColor }}>{result}</h2>
      <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>Points: {totalPoints}</p>
      <p style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>Time: {timeLeft}s</p>
      {gameOver && (
        <div style={{ textAlign: 'center', marginTop: '20px', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <h3>Game Over!</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Final Score: {sessionScore}</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>Result: {sessionResult}</p>
        </div>
      )}
    </div>
  );
}
