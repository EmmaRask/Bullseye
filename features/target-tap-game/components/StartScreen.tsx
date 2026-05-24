"use client";

import Image from "next/image";
import { useStartGame } from "../../../hooks/useStartGame";
import { useTivoliUser } from "../../../hooks/useTivoliUser";
import { GameSessionModal } from "./GameSessionModal";
import styles from "./StartScreen.module.css";

export function StartScreen() {
  const {
    isLoading,
    errorMessage,
    handleStartGame,
  } = useStartGame();

  const {
    playerName,
    loading,
    error,
  } = useTivoliUser();

  return (
    <>
      <GameSessionModal />
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
  
        {loading ? (
          <p>Loading player...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <p>
            Howdy {playerName}! Got what it takes to win, partner?
          </p>
      )}
        <h2>How to play</h2>
        <p>
          Mobile: Click on the screen to shoot at the targets throu your moving crosshair! 
          <br/>
          Use computer? no worries parner! Just use your spacebar on your computer to hit your targets, same moving crosshair will test your skills!
        </p>
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
    </>
  );
}