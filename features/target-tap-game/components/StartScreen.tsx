"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTransaction } from "../../../api/centralbankApi";
import Image from "next/image";
import styles from "./StartScreen.module.css";

export function StartScreen() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleStartGame(): Promise<void> {
    if (!playerName.trim()) {
      setErrorMessage("Please enter your first name before starting.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      localStorage.setItem("playerName", playerName.trim());

      const transaction = await createTransaction({
        identityToken: "mock-token",
        amount: 5,
        amusementUuid: "bullseye",
      });

      localStorage.setItem(
      "transaction",
      JSON.stringify(transaction)
    );

    router.push("/play");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    //<main className={styles.container}>
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
              Ye haaw! Klick om the screen or use your keyboard to hit your
              targets! Are you a quick enough draw cowboy?
            </p>

          <label htmlFor="playerName">Player name</label>
          <input
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
    //</main>
  );
}
