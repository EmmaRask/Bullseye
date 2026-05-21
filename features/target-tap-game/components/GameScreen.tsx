'use client';

import { useEffect, useState } from 'react';
import styles from './GameScreen.module.css';
import { GameSessionModal } from './GameSessionModal';
import { gameSession } from '../../../game/gameSession';
import { TargetBoard } from "./TargetBoard";
import { ShotMarkers } from "./ShotMarkers";
import {
  CIRCLE_SIZE,
  CONTAINER_WIDTH,
  CONTAINER_HEIGHT,
  GAME_DURATION,
  LOSE_LIMIT,
  WIN_LIMIT,
  SHOT_COOLDOWN,
} from "../../../game/config";
import { getSessionResult } from "../../../game/result";
import { targetRandomizer } from '../../../game/targetRandomizer';
import type { PositionedTarget } from "../../../game/types";
import { useCirclePhysics } from '../../../hooks/useCirclePhysics';
import { useShootingLogic } from '../../../hooks/useShootingLogic';
import { useGamePoints } from '../../../hooks/useGamePoints';
import { Crosshair } from './Crosshair';
import { useSaveScoreAndRedirect } from "../../../hooks/useSaveScoreAndRedirect";


const GAME_STATE_KEY = 'game_state';

type GameState = {
  sessionScore: number;
  timeLeft: number;
};

export default function GameScreen() {
  const [targets, setTargets] = useState<PositionedTarget[]>([]);
  const [sessionScore, setSessionScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [sessionResult, setSessionResult] = useState<'lose' | 'replay' | 'win' | null>(null);
  const [lastShotTime, setLastShotTime] = useState(0);
  const [isRestored, setIsRestored] = useState(false);
  const { circleX, circleY } = useCirclePhysics();
  const { totalPoints, addPoints, isHighlighted } = useGamePoints(sessionScore);
  const { result, resultColor, shots, handleClick, flashingTargets } = useShootingLogic(targets, addPoints);
  

  // Restore game state from localStorage after hydration
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(GAME_STATE_KEY);
    if (saved) {
      try {
        const gameState: GameState = JSON.parse(saved);
        console.log('Game state restored from localStorage:', gameState);
        setSessionScore(gameState.sessionScore);
        setTimeLeft(gameState.timeLeft);
      } catch (e) {
        console.error('Failed to parse saved game state:', e);
      }
    }
    setIsRestored(true);
  }, []);

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

  // Save game state whenever score or time changes (but NOT on initial restore)
  useEffect(() => {
    if (typeof window === 'undefined' || gameOver || !isRestored) return;
    
    const gameState: GameState = { sessionScore, timeLeft };
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
    console.log('Game state saved to localStorage:', gameState);
  }, [sessionScore, timeLeft, gameOver, isRestored]);

  // Sync session score with total points during gameplay (only after player shoots)
  useEffect(() => {
    if (gameOver || !isRestored || totalPoints === 0) return;
    console.log('Syncing sessionScore with totalPoints:', totalPoints);
    setSessionScore(totalPoints);
  }, [totalPoints, gameOver, isRestored]);

  // Timer effect
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          console.log('Game ending with score:', totalPoints);
          setGameOver(true);
          setSessionScore(totalPoints);
          gameSession.finishGame();
          
          // Clear saved game state on game end
          if (typeof window !== 'undefined') {
            localStorage.removeItem(GAME_STATE_KEY);
            console.log('Cleared game_state from localStorage');
          }
          
          // Determine session result based on score
         setSessionResult(getSessionResult(totalPoints, LOSE_LIMIT, WIN_LIMIT));
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver, totalPoints]);

  useSaveScoreAndRedirect({ gameOver, sessionScore });

  const handleGameClick = () => {
    if (gameOver) return;
    
    const now = Date.now();
    if (now - lastShotTime < SHOT_COOLDOWN) return;
    
    setLastShotTime(now);
    handleClick(circleX, circleY);
  };

  return (
    <>
      <GameSessionModal />
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
       <TargetBoard targets={targets} flashingTargets={flashingTargets} />

        {/* Shot markers */}
       <ShotMarkers shots={shots} />

        {/* Moving blue circle */}
        <Crosshair x={circleX} y={circleY} />

        {/* Game over overlay */}
        {gameOver && (
          <div className={styles.gameOverOverlay}>
            Game over! Redirecting...
          </div>
        )}
      </div>

      <h2 className={styles.resultText} style={{ color: resultColor }}>{result}</h2>
      <p className={styles.pointsText} style={{ color: isHighlighted ? 'whitesmoke' : 'inherit' }}>Points: {sessionScore}</p>
      <p className={styles.timerText}>Time: {timeLeft}s</p>
      </div>
    </>
  );
}
