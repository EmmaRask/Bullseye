export const CIRCLE_SIZE = 15;
export const CONTAINER_WIDTH = 300;
export const CONTAINER_HEIGHT = 500;
export const BORDER_WIDTH = 2; // border thickness on each side
export const BUOYANCY = 0.08; // strength of center-seeking force

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
