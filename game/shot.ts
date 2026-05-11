// game/shot.ts

import { CIRCLE_SIZE } from "./config";

export function calculateShotPosition(circleX: number, circleY: number) {
  // circleX and circleY are already centered by the crosshair's transform
  // So we just add CIRCLE_SIZE/2 to account for the top-left positioning
  return { x: circleX, y: circleY };
}