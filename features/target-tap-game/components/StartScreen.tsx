"use client";

import Image from "next/image";
import { useStartGame } from "../../../hooks/useStartGame";
import { useTivoliUser } from "../../../hooks/useTivoliUser";
import { GameSessionModal } from "./GameSessionModal";
import styles from "./StartScreen.module.css";
import { PAYOUT_AMOUNT, REPLAY_COST, WIN_LIMIT, ENTRY_COST, TARGETS_CONFIG, POINTS_MAP } from "@/game/config";

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
          <p aria-live="polite">Loading player...</p>
            ) : error ? (
          <p role="alert" className={styles.errorMessage}>{error}</p>
        ) : (
          <p>
            Howdy {playerName}! Got what it takes to win, partner?
          </p>
        )}
        
        <div className={styles.instructions}>

          <h2>Pricing & Winnings</h2>

          <p>
            Entry cost: {ENTRY_COST}€
          </p>
          <p>
            Replay cost on same token: {REPLAY_COST}€
          </p>

          <p>
            Winnings over {WIN_LIMIT} points: {PAYOUT_AMOUNT}€
          </p>

          <h2>How to play</h2>

          <p>A rectangular game area houses five targets of different sizes. A reticle moves across this area. Shoot while the reticle overlaps with a target to hit the target to score points.</p>

          <p>
            Target points guide:
          </p>

          <ul>
            {TARGETS_CONFIG.map((target) => (
              <li key={target.label}>
                {target.label} - {POINTS_MAP[target.label]} points
              </li>
            ))}
          </ul>

            <h2>Controls</h2>

          <p>
            Mobile: tap within the game area to shoot
          </p>

          <p>
            Desktop: press spacebar or click within the game area to shoot
          </p>
        </div>
      </section>

      <section className={styles.panel}>
        <button
          type="button"
          className={styles.button}
          onClick={handleStartGame}
          disabled={isLoading}
          aria-describedby={errorMessage ? "start-error" : undefined}
        >
          {isLoading ? "Starting..." : "Pay & Start"}
        </button>

        {errorMessage && (
          <p id="start-error" role="alert" className={styles.errorMessage}>
            {errorMessage}
          </p> 
        )}
      </section>
      </div>
    </>
  );
}