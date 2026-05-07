// game/shot.ts

import { CIRCLE_SIZE } from "./config";

export function calculateShotPosition(circleX: number, circleY: number) {
  const shotX = circleX + CIRCLE_SIZE / 2;
  const shotY = circleY + CIRCLE_SIZE / 2;

  return { x: shotX, y: shotY };
}