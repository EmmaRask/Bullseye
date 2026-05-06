import { useState } from 'react';
import { CIRCLE_SIZE } from './gameConstants';

export const useShootingLogic = (
  targets: Array<{ size: number; label: string; x: number; y: number }>,
  onHit?: (targetLabel: string) => void
) => {
  const [result, setResult] = useState('');
  const [resultColor, setResultColor] = useState('');
  const [shots, setShots] = useState<Array<{ x: number; y: number }>>([]);

  const handleClick = (circleX: number, circleY: number) => {
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
      const targetCenterX = target.x + target.size / 2;
      const targetCenterY = target.y + target.size / 2;

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
      onHit?.(hitTarget.label);
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

  return { result, resultColor, shots, handleClick };
};
