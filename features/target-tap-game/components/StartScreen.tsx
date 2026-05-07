"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { mockStartGame } from "../../../api/mockCentralbankApi";
import styles from "./StartScreen.module.css";

export function StartScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


//   async function handleStartGame(): Promise<void> {
//   try {
//     setIsLoading(true);
//     setErrorMessage(null);

//     await mockStartGame();

//     router.push("/play");
//   } catch {
//     setErrorMessage("Something went wrong. Please try again.");
//   } finally {
//     setIsLoading(false);
//   }
// } DEBUGGING TRY

async function handleStartGame() {
  router.push("/play");
}
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1>🎯 Target Tap</h1>

        <section>
          <h2>How to play</h2>
          <p>Tap when the ball is over a target.</p>
        </section>

        <button
            className={styles.button}
            onClick={handleStartGame}
            disabled={isLoading}
            >
            {isLoading ? "Starting..." : "Pay & Start"}
        </button>
        {errorMessage && <p role="alert">{errorMessage}</p>}
      </div>
    </main>
  );
}