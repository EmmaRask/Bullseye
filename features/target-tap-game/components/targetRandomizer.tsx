import { CONTAINER_WIDTH, CONTAINER_HEIGHT, TARGETS_CONFIG } from './gameConstants';

export const targetRandomizer = () => {
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
