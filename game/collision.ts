export function isShotInsideTarget(
  shotX: number,
  shotY: number,
  targetX: number,
  targetY: number,
  targetSize: number
): boolean {
  const targetCenterX = targetX + targetSize / 2;
  const targetCenterY = targetY + targetSize / 2;

  const distance = Math.sqrt(
    (shotX - targetCenterX) ** 2 + (shotY - targetCenterY) ** 2
  );

  return distance < targetSize / 2;
}