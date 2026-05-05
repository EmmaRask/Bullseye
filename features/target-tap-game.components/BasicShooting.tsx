'use client';

import React, { useState, useEffect, useRef } from 'react';

const CIRCLE_SIZE = 15;
const CONTAINER_WIDTH = 300;
const CONTAINER_HEIGHT = 500;
const BORDER_WIDTH = 2; // border thickness on each side
const BUOYANCY = 0.08; // strength of center-seeking force

export default function BasicShooting() {
  const [circleY, setCircleY] = useState(0);
  const [circleX, setCircleX] = useState(0);
  const velocityRef = useRef({ x: 0, y: 0 });

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

    const interval = setInterval(animate, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '300px',
        height: '500px',
        border: '2px solid black',
      }}
    >
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
  );
}
