import styles from "./GameScreen.module.css";

type Shot = {
  x: number;
  y: number;
};

type ShotMarkersProps = {
  shots: Shot[];
};

export function ShotMarkers({ shots }: ShotMarkersProps) {
  return (
    <>
      {shots.map((shot, index) => (
        <div
          key={`${shot.x}-${shot.y}-${index}`}
          className={styles.shotMarker}
          style={{
            left: `${shot.x - 3}px`,
            top: `${shot.y - 3}px`,
          }}
        />
      ))}
    </>
  );
}