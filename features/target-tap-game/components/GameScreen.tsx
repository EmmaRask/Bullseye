'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './GameScreen.module.css';
import { CIRCLE_SIZE, CONTAINER_WIDTH, CONTAINER_HEIGHT, BORDER_WIDTH, BUOYANCY, SHOT_COOLDOWN } from '../../../game/config';
import { GAME_DURATION, LOSE_LIMIT, WIN_LIMIT } from './gameConstants';
import { targetRandomizer } from '../../../game/targetRandomizer';
import { useCirclePhysics } from '../../../hooks/useCirclePhysics';
import { useShootingLogic } from '../../../hooks/useShootingLogic';
import { useGamePoints } from '../../../hooks/useGamePoints';
import { Crosshair } from './Crosshair';
import { supabase } from '@/lib/supabase';


export default function GameScreen() {
  const router = useRouter();
  const [targets, setTargets] = useState<Array<{ size: number; label: string; x: number; y: number }>>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionResult, setSessionResult] = useState<'lose' | 'replay' | 'win' | null>(null);
  const [lastShotTime, setLastShotTime] = useState(0);
  const { circleX, circleY } = useCirclePhysics();
  const { totalPoints, addPoints } = useGamePoints();
  const { result, resultColor, shots, handleClick } = useShootingLogic(targets, addPoints);

  // Initialize targets on mount
  useEffect(() => {
    setTargets(targetRandomizer());
  }, []);

  // Spacebar handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleGameClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, circleX, circleY]);

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

  // Redirect to result page when game over
  useEffect(() => {
  if (!gameOver) return;

  const saveScoreAndRedirect = async () => {
    const playerName = localStorage.getItem("playerName") ?? "Unknown";

    const { error } = await supabase.from("scores").insert([
      {
        player_name: playerName,
        score: sessionScore,
      },
    ]);

    if (error) {
      console.error("Error saving score:", error);
    }

    router.push("/result");
  };

  saveScoreAndRedirect();
  }, [gameOver, sessionScore, router]);

  const handleGameClick = () => {
    if (gameOver) return;
    
    const now = Date.now();
    if (now - lastShotTime < SHOT_COOLDOWN) return;
    
    setLastShotTime(now);
    handleClick(circleX, circleY);
  };

  return (
    <div className={styles.pageWrapper}>
      <div
        onClick={handleGameClick}
        className={styles.gameContainer}
        style={{
          width: `${CONTAINER_WIDTH}px`,
          height: `${CONTAINER_HEIGHT}px`,
        }}
      >
        {/* Targets */}
        {targets.map((target) => (
          <div
            key={target.label}
            className={styles.target}
            style={{
              left: `${target.x}px`,
              top: `${target.y}px`,
              width: `${target.size}px`,
              height: `${target.size}px`,
            }}
          >
            <img
              src="/bullseye-target.svg"
              alt="target"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
        ))}

        {/* Shot markers */}
        {shots.map((shot, i) => (
          <div
            key={i}
            className={styles.shotMarker}
            style={{
              left: `${shot.x - 3}px`,
              top: `${shot.y - 3}px`,
            }}
          />
        ))}

        {/* Moving blue circle */}
        <Crosshair x={circleX} y={circleY} />
      </div>

      <h2 className={styles.resultText} style={{ color: resultColor }}>{result}</h2>
      <p className={styles.pointsText}>Points: {totalPoints}</p>
      <p className={styles.timerText}>Time: {timeLeft}s</p>
    </div>
  );
}
