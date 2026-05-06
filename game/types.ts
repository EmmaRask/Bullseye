export interface TargetConfig {
  readonly size: number;
  readonly label: string;
}

export interface PositionedTarget extends TargetConfig {
  readonly x: number;
  readonly y: number;
}