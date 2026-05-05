'use client';

import React, { useState, useEffect, useRef } from 'react';

const CIRCLE_SIZE = 15;
const CONTAINER_WIDTH = 300;
const CONTAINER_HEIGHT = 500;
const BORDER_WIDTH = 2; // border thickness on each side
const BUOYANCY = 0.08; // strength of center-seeking force

const TARGETS_CONFIG = [
  { size: 20, label: 'XS' },
  { size: 30, label: 'S' },
  { size: 40, label: 'M' },
  { size: 50, label: 'L' },
  { size: 60, label: 'XL' },
];

const generateRandomPositions = () => {
  const PADDING = 10;
  const positions: Array<{ size: number; label: string; x: number; y: number }> = [];
  const usedAreas: Array<{ x: number; y: number; size: number }> = [];

  // Helper to check if a position overlaps with existing targets
  const overlaps = (newX: number, newY: number, newSize: number) => {
    for (const used of usedAreas) {
      const dx = newX + newSize / 2 - (used.x + used.size / 2);
      const dy = newY + newSize / 2 - (used.y + used.size / 2);
      const minDistance = (newSize + used.size) / 2 + PADDING;
      if (Math.sqrt(dx * dx + dy * dy) < minDistance) {
        return true;
      }
    }
    return false;
  };

  // Try to place each target
  for (const config of TARGETS_CONFIG) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      const x = Math.random() * (CONTAINER_WIDTH - config.size - PADDING * 2) + PADDING;
      const y = Math.random() * (CONTAINER_HEIGHT - config.size - PADDING * 2) + PADDING;

      if (!overlaps(x, y, config.size)) {
        positions.push({ ...config, x, y });
        usedAreas.push({ x, y, size: config.size });
        placed = true;
      }

      attempts++;
    }

    // If we couldn't place it after max attempts, place it anyway
    if (!placed) {
      const x = Math.random() * (CONTAINER_WIDTH - config.size - PADDING * 2) + PADDING;
      const y = Math.random() * (CONTAINER_HEIGHT - config.size - PADDING * 2) + PADDING;
      positions.push({ ...config, x, y });
    }
  }

  return positions;
};

export default function BasicShooting() {
  const [circleY, setCircleY] = useState(0);
  const [circleX, setCircleX] = useState(0);
  const [result, setResult] = useState('');
  const [resultColor, setResultColor] = useState('');
  const [shots, setShots] = useState<Array<{ x: number; y: number }>>([]);
  const [targets, setTargets] = useState<Array<{ size: number; label: string; x: number; y: number }>>([]);
  const velocityRef = useRef({ x: 0, y: 0 });

  // Initialize targets on mount
  useEffect(() => {
    setTargets(generateRandomPositions());
  }, []);

  const getTargetPosition = (target: { x: number; y: number }) => ({
    x: target.x,
    y: target.y,
  });

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

    // Check collision with all targets, from smallest to largest
    let hitTarget = null;
    for (const target of targets) {
      const targetPos = getTargetPosition(target);
      const targetCenterX = targetPos.x + target.size / 2;
      const targetCenterY = targetPos.y + target.size / 2;

      const distance = Math.sqrt(
        (shotX - targetCenterX) ** 2 + (shotY - targetCenterY) ** 2
      );

      if (distance < target.size / 2) {
        hitTarget = target;
        break;
      }
    }

    if (hitTarget) {
      setResult(`Hit ${hitTarget.label}!`);
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
        {/* Targets */}
        {targets.map((target) => {
          const pos = getTargetPosition(target);
          return (
            <div
              key={target.label}
              style={{
                position: 'absolute',
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                width: `${target.size}px`,
                height: `${target.size}px`,
                background: 'red',
                borderRadius: '50%',
              }}
            />
          );
        })}

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
