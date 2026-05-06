'use client';

import React, { useEffect, useState } from 'react';
import { CIRCLE_SIZE, CONTAINER_WIDTH, CONTAINER_HEIGHT, BORDER_WIDTH } from './gameConstants';
import { targetRandomizer } from './targetRandomizer';
import { useCirclePhysics } from './useCirclePhysics';
import { useShootingLogic } from './useShootingLogic';

export default function GameScreen() {
  const [targets, setTargets] = useState<Array<{ size: number; label: string; x: number; y: number }>>([]);
  const { circleX, circleY } = useCirclePhysics();
  const { result, resultColor, shots, handleClick } = useShootingLogic(targets);

  // Initialize targets on mount
  useEffect(() => {
    setTargets(targetRandomizer());
  }, []);

  const handleGameClick = () => {
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
    </div>
  );
}
