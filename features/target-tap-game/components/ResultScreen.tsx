'use client';

/**
 * Result screen for completed game session.
 * Uses Tivoli transaction id for payout when the player wins.
 */
import { useEffect, useState } from "react";
import { payoutTransaction } from '../../../api/centralbankApi';
import { useResultData } from '../../../hooks/useResultData';
import { gameSession } from '../../../game/gameSession';
import { GameSessionModal } from './GameSessionModal';
import styles from './ResultScreen.module.css';
import { WIN_LIMIT,
        REPLAY_COST,
        PAYOUT_AMOUNT,
        REPLAY_WINDOW_MS, } from '../../../game/config'; 
import { useRouter } from "next/navigation";
import { createTransaction } from "../../../api/centralbankApi";

export function ResultScreen() {
  const { scores, sessionScore, stamp, transactionId } = useResultData();
  const router = useRouter();
  const hasWon = sessionScore >= WIN_LIMIT;
  const payoutAmount = hasWon ? PAYOUT_AMOUNT : 0;

  const [canReplay, setCanReplay] = useState(false);

  useEffect(() => {
  const replayWindowStartedAt = Number(
    sessionStorage.getItem("replay_window_started_at")
  );

  setCanReplay(
    replayWindowStartedAt > 0 &&
      Date.now() - replayWindowStartedAt < REPLAY_WINDOW_MS
  );
  }, []);

  useEffect(() => {
  if (!hasWon || !transactionId) return;

  const stored = sessionStorage.getItem("winning_transaction_ids");
  const winningIds: string[] = stored ? JSON.parse(stored) : [];

  if (!winningIds.includes(transactionId)) {
    winningIds.push(transactionId);
    sessionStorage.setItem(
      "winning_transaction_ids",
      JSON.stringify(winningIds)
    );
  }
}, [hasWon, transactionId]);
  
  function closeAmusement(): void {
    window.parent.postMessage(
      { type: "AMUSEMENT_CLOSE" },
      "https://loopland.se"
    );
  }
  
  async function handlePayout(): Promise<void> {
  const stored = sessionStorage.getItem("winning_transaction_ids");
  const winningIds: string[] = stored ? JSON.parse(stored) : [];

  if (winningIds.length === 0) {
    gameSession.reset();
    closeAmusement();
    return;
  }

  try {
    await Promise.all(
      winningIds.map((id) =>
        payoutTransaction(id, {
          amount: PAYOUT_AMOUNT,
        })
      )
    );

    sessionStorage.removeItem("winning_transaction_ids");
    gameSession.reset();
    closeAmusement();
  } catch (error) {
    console.error("Payout failed:", error);
  }
  }

  async function handleReplay(): Promise<void> {
  const identityToken = sessionStorage.getItem("identity_token");

  if (!canReplay) {
  console.error("Replay window has expired");
  return;
}

  if (!identityToken) {
    console.error("Missing identity token for replay");
    return;
  }

  try {
    const transaction = await createTransaction({
      identity_token: identityToken,
      amount: REPLAY_COST,
    });

    sessionStorage.setItem("transaction", JSON.stringify(transaction));
    gameSession.setTransaction(String(transaction.transaction_id));

    sessionStorage.removeItem("sessionScore");
    sessionStorage.removeItem("game_state");

    gameSession.startGame();

    router.push("/play");
  } catch (error) {
    console.error("Replay failed:", error);
  }
}

  return (
    <>
      <GameSessionModal />
      <div className={styles.pageWrapper}>
      <p className={styles.topSign}>High scores</p>

      <p className={styles.topSign}>Your score: {sessionScore}</p>

      <div className={styles.top10}>
        {Array.from({ length: 10 }).map((_, index) => (
          <div className={styles.scoreEntry} key={index}>
            #{index + 1} {scores[index]?.player_name || '-'} -{' '}
            {scores[index]?.score || '-'}
          </div>
        ))}
      </div>

      <div className={styles.rewards}>
        <p className={styles.payoutAmount}>
          {hasWon ? `${payoutAmount}€` : '0€'}
        </p>

        <div className={styles.stampCircle}>
          {stamp ? (
              typeof stamp === 'string' ? (
              <span>{stamp}</span>
            ) : (
            <>
            <img
              src={stamp.image_url.replace('http://', 'https://')}
              alt={`${stamp.metal ?? ''} ${stamp.animal}`}
              className={styles.stampImage}
            />

           <span>
            {stamp.metal
              ? `${stamp.metal} `
              : ''}
            {stamp.animal}
          </span>
          </>
          )
        ) : (
          <span>No new stamp this round, partner</span>
        )}
      </div>
      </div>

      <div className={styles.hori}>
        <button className={styles.quit} onClick={handlePayout}>
          {hasWon ? 'Payout & Quit' : 'Quit'}
        </button>
        {canReplay && (
          <button className={styles.replay} onClick={handleReplay}>
            Play again for {REPLAY_COST}€
          </button>
        )}
      </div>
      </div>
    </>
  );
}