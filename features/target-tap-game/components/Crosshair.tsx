// Crosshair.tsx
import styles from "./Crosshair.module.css";

type CrosshairProps = {
  x: number;
  y: number;
};

export function Crosshair({ x, y }: CrosshairProps) {
  return (
    <div
      className={styles.crosshair}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      aria-hidden="true"
    >
      <div className={styles.dot} />
    </div>
  );
}