import { useEffect, useRef, useState } from 'react';
import { CIRCLE_SIZE, CONTAINER_WIDTH, CONTAINER_HEIGHT, BORDER_WIDTH, BUOYANCY } from '.././game/config';

export const useCirclePhysics = () => {
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

    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, []);

  return { circleX, circleY };
};
