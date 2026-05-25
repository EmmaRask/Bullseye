
export const CIRCLE_SIZE = 15;
export const CONTAINER_WIDTH = 300;
export const CONTAINER_HEIGHT = 500;
export const BORDER_WIDTH = 2; // border thickness on each side
export const BUOYANCY = 1000; // strength of center-seeking force (scaled for delta time)
export const GAME_DURATION = 30; // seconds
export const LOSE_LIMIT = 200; // minimum score to avoid losing
export const WIN_LIMIT = 200; // minimum score to win
export const SHOT_COOLDOWN = 90; // milliseconds between shots

export const TARGETS_CONFIG = [
  { size: 20, label: 'XS' },
  { size: 30, label: 'S' },
  { size: 40, label: 'M' },
  { size: 50, label: 'L' },
  { size: 60, label: 'XL' },
];

export const POINTS_MAP: Record<string, number> = {
  XS: 50,
  S: 40,
  M: 30,
  L: 20,
  XL: 10,
};

export const ENTRY_COST = 2;
export const REPLAY_COST = 1;
export const PAYOUT_AMOUNT = 4;

export const REPLAY_WINDOW_MS = 3 * 60 * 1000;