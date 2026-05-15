"use client";

import Image from "next/image";
import { useStartGame } from "../../../hooks/useStartGame";
import styles from "./StartScreen.module.css";

export function StartScreen() {
  const {
    playerName,
    setPlayerName,
    isLoading,
    errorMessage,
    handleStartGame,
  } = useStartGame();

  return (
    <div className={styles.wrapper}>
      <section className={`${styles.panel} ${styles.heroPanel}`}>
        <h1 className={styles.title}>BULLSEYE</h1>

        <div className={styles.targetWrapper}>
          <Image
            src="/images/bullseye-target.svg"
            alt="Bullseye target"
            width={300}
            height={300}
            priority
          />
        </div>
      </section>

      <section className={styles.panel}>
        <h2>How to play</h2>

        <p>
          Ye haaw! Click on the screen or use your keyboard to hit your
          targets! Are you a quick enough draw, cowboy?
        </p>

        <label className={styles.nameLabel} htmlFor="playerName">
          Player name
        </label>

        <input
          className={styles.nameInput}
          id="playerName"
          type="text"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          placeholder="Enter your name"
        />
      </section>

      <section className={styles.panel}>
        <button
          className={styles.button}
          onClick={handleStartGame}
          disabled={isLoading}
        >
          {isLoading ? "Starting..." : "Pay & Start"}
        </button>

        {errorMessage && <p role="alert">{errorMessage}</p>}
      </section>
    </div>
  );
}