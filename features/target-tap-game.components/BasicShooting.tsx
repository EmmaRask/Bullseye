'use client';

import React, { useState, useEffect, useRef } from 'react';

const CIRCLE_SIZE = 15;
const TARGET_SIZE = 40;
const CONTAINER_WIDTH = 70;
const CONTAINER_HEIGHT = 70;
const BORDER_WIDTH = 2; // border thickness on each side
const BUOYANCY = 0.08; // strength of center-seeking force

export default function BasicShooting() {
  const [circleY, setCircleY] = useState(0);
  const [circleX, setCircleX] = useState(0);
  const [result, setResult] = useState('');
  const [resultColor, setResultColor] = useState('');
  const [shots, setShots] = useState<Array<{ x: number; y: number }>>([]);
  const velocityRef = useRef({ x: 0, y: 0 });

  const target = {
    x: (CONTAINER_WIDTH - TARGET_SIZE) / 2,
    y: (CONTAINER_HEIGHT - TARGET_SIZE) / 2,
  };

  useEffect(() => {
    const animate = () => {
      setCircleY((prev) => {
        let y = prev;
        let vy = velocityRef.current.y;

        // Calculate center for buoyancy effect
        const yCenter = (CONTAINER_HEIGHT - CIRCLE_SIZE - BORDER_WIDTH * 2) / 2;
        
        // Apply buoyancy force (pulls toward center)
        const yDistance = y - yCenter;
        const accelY = -BUOYANCY * yDistance / ((CONTAINER_HEIGHT - CIRCLE_SIZE) / 2);
        vy += accelY;

        // Apply movement
        y += vy;

        velocityRef.current = { ...velocityRef.current, y: vy };
        return y;
      });

      setCircleX((prev) => {
        let x = prev;
        let vx = velocityRef.current.x;

        // Calculate center for buoyancy effect
        const xCenter = (CONTAINER_WIDTH - CIRCLE_SIZE - BORDER_WIDTH * 2) / 2;
        
        // Apply buoyancy force (pulls toward center)
        const xDistance = x - xCenter;
        const accelX = -BUOYANCY * xDistance / ((CONTAINER_WIDTH - CIRCLE_SIZE) / 2);
        vx += accelX;

        // Apply movement
        x += vx;

        velocityRef.current = { ...velocityRef.current, x: vx };
        return x;
      });
    };

    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    // Record shot position
    const shotX = circleX + CIRCLE_SIZE / 2;
    const shotY = circleY + CIRCLE_SIZE / 2;

    setShots((prev) => [
      ...prev,
      {
        x: shotX,
        y: shotY,
      },
    ]);

    // Circle-to-circle collision detection (black dot to red target)
    const targetCenterX = target.x + TARGET_SIZE / 2;
    const targetCenterY = target.y + TARGET_SIZE / 2;

    const distance = Math.sqrt(
      (shotX - targetCenterX) ** 2 +
        (shotY - targetCenterY) ** 2
    );

    const minDistance = 0 + TARGET_SIZE / 2; // point collision with target radius
    const hit = distance < minDistance;

    if (hit) {
      setResult('Hit!');
      setResultColor('limegreen');
    } else {
      setResult('Miss!');
      setResultColor('red');
    }

    // Clear result after 500ms
    setTimeout(() => {
      setResult('');
      setResultColor('');
    }, 500);
  };

  return (
    <div>
      <div
        onClick={handleClick}
        style={{
          position: 'relative',
          width: `${CONTAINER_WIDTH}px`,
          height: `${CONTAINER_HEIGHT}px`,
          border: `${BORDER_WIDTH}px solid black`,
        }}
      >
        {/* Target */}
        <div
          style={{
            position: 'absolute',
            left: `${target.x}px`,
            top: `${target.y}px`,
            width: `${TARGET_SIZE}px`,
            height: `${TARGET_SIZE}px`,
            background: 'red',
            borderRadius: '50%',
          }}
        />

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
