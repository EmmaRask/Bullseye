import styles from "./GameScreen.module.css";
import type { PositionedTarget } from "../../../game/types";

type TargetBoardProps = {
  targets: PositionedTarget[];
  flashingTargets: Set<string>;
};

export function TargetBoard({ targets, flashingTargets }: TargetBoardProps) {
  return (
    <>
      {targets.map((target) => (
        <div
          key={target.label}
          className={`${styles.target} ${
            flashingTargets.has(target.label) ? styles.flash : ""
          }`}
          style={{
            left: `${target.x}px`,
            top: `${target.y}px`,
            width: `${target.size}px`,
            height: `${target.size}px`,
          }}
        >
          <img
            src="/bullseye-target.svg"
            alt=""
            aria-hidden="true"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      ))}
    </>
  );
}