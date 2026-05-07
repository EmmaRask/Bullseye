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

  function handleClick(circleX: number, circleY: number) {
    const shot = calculateShotPosition(circleX, circleY);

    setShots((prev) => [...prev, shot]);

    let hitTarget: Target | null = null;

    for (const target of targets) {
      const isHit = isShotInsideTarget(
        shot.x,
        shot.y,
        target.x,
        target.y,
        target.size
      );

      if (isHit) {
        hitTarget = target;
        break;
      }
    }

    if (hitTarget) {
      setResult(`Hit ${hitTarget.label}!`);
      setResultColor("limegreen");
      onHit?.(hitTarget.label);
    } else {
      setResult("Miss!");
      setResultColor("red");
    }

    setTimeout(() => {
      setResult("");
      setResultColor("");
    }, 500);
  }

  return { result, resultColor, shots, handleClick };
}