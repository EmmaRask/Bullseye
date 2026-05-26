"use client";

import Image from "next/image";
import { useStartGame } from "../../../hooks/useStartGame";
import { useTivoliUser } from "../../../hooks/useTivoliUser";
import { GameSessionModal } from "./GameSessionModal";
import styles from "./StartScreen.module.css";
import { PAYOUT_AMOUNT, REPLAY_COST, WIN_LIMIT, ENTRY_COST } from "@/game/config";

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
        <div className={styles.instructions}>
          <p>
            {ENTRY_COST}€ to play game to win {PAYOUT_AMOUNT}€ and get your fancy stamp.
          </p>

          <p>
            Winnings over {WIN_LIMIT} points: {PAYOUT_AMOUNT}€!
          </p>

          <p>
            Each target gives different points:
          </p>

          <ul>
            <li>XL - 10 points</li>
            <li>L - 20 points</li>
            <li>M - 30 points</li>
            <li>S - 40 points</li>
          </ul>

          <p>
            Replay cheap during your token period for just {REPLAY_COST}€!
          </p>

          <p>
            Mobile: tap the screen to shoot through your moving crosshair.
          </p>

          <p>
            Computer: use spacebar or tuchpad to hit your targets, partner!
          </p>
        </div>
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