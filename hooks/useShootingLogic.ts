// hooks/useShootingLogic.ts

import { useState } from "react";
import { calculateShotPosition } from "../game/shot";
import { isShotInsideTarget } from "../game/collision";

type Target = {
  size: number;
  label: string;
  x: number;
  y: number;
};

type Shot = {
  x: number;
  y: number;
};

export function useShootingLogic(targets: Target[], onHit?: (label: string) => void) {
  const [result, setResult] = useState("");
  const [resultColor, setResultColor] = useState("");
  const [shots, setShots] = useState<Shot[]>([]);
  const [flashingTargets, setFlashingTargets] = useState<Set<string>>(new Set());

  function handleClick(circleX: number, circleY: number) {
    const shot = calculateShotPosition(circleX, circleY);

    setShots((prev) => [...prev, shot]);

    for (const target of targets) {
      const isHit = isShotInsideTarget(
        shot.x,
        shot.y,
        target.x,
        target.y,
        target.size
      );

      if (isHit) {
        setFlashingTargets((prev) => new Set(prev).add(target.label));
        setTimeout(() => {
          setFlashingTargets((prev) => {
            const next = new Set(prev);
            next.delete(target.label);
            return next;
          });
        }, 100);
        onHit?.(target.label);
        break;
      }
    }
  }

  return { result, resultColor, shots, handleClick, flashingTargets };
}