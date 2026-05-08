"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTransaction } from "../../../api/centralbankAPI";
import styles from "./StartScreen.module.css";

export function StartScreen() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleStartGame(): Promise<void> {
    if (!playerName.trim()) {
      setErrorMessage("Please enter your name before starting.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      localStorage.setItem("playerName", playerName.trim());

      await createTransaction({
        seller: "bullseye",
        buyer: playerName.trim(),
        amount: 5,
      });

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

        <label htmlFor="playerName">Player name</label>
        <input
          id="playerName"
          type="text"
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          placeholder="Enter your name"
        />

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