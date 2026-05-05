"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { GAME_CONFIG } from "../../../game/config";
import styles from "./StartScreen.module.css";

export function StartScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleStartGame(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      // senare: await startGamePayment()
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.push("/play");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1>🎯 Target Tap</h1>

        <section>
          <h2>How to play</h2>
          <p>Tap when the ball is over a target.</p>
        </section>

        <button className={styles.button}>
          Pay & Start
        </button>
      </div>
    </main>
  );
}