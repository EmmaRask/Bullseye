import { useEffect, useRef, useState } from 'react';
import { CIRCLE_SIZE, CONTAINER_WIDTH, CONTAINER_HEIGHT, BORDER_WIDTH, BUOYANCY } from '.././game/config';

export const useCirclePhysics = () => {
  const [circleY, setCircleY] = useState(0);
  const [circleX, setCircleX] = useState(0);
  const velocityRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let lastTime = Date.now();
    let animationId: number;

    const animate = () => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 1000; // Convert to seconds
      lastTime = now;

      setCircleY((prev) => {
        let y = prev;
        let vy = velocityRef.current.y;

        // Calculate center for buoyancy effect
        const yCenter = (CONTAINER_HEIGHT) / 2;
        
        // Apply buoyancy force (pulls toward center)
        const yDistance = y - yCenter;
        const accelY = -BUOYANCY * yDistance / ((CONTAINER_HEIGHT) / 2);
        vy += accelY * deltaTime;

        // Apply movement
        y += vy * deltaTime;

        velocityRef.current = { ...velocityRef.current, y: vy };
        return y;
      });

      setCircleX((prev) => {
        let x = prev;
        let vx = velocityRef.current.x;

        // Calculate center for buoyancy effect
        const xCenter = (CONTAINER_WIDTH) / 2;
        
        // Apply buoyancy force (pulls toward center)
        const xDistance = x - xCenter;
        const accelX = -BUOYANCY * xDistance / ((CONTAINER_WIDTH) / 2);
        vx += accelX * deltaTime;

        // Apply movement
        x += vx * deltaTime;

        velocityRef.current = { ...velocityRef.current, x: vx };
        return x;
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return { circleX, circleY };
};
