'use client';

/**
 * Temporary mock Centralbank integration.
 * Replace localStorage + mock payout when official API is available.
 */

import { useRouter } from 'next/navigation';
import { payoutTransaction } from '../../../api/centralbankApi';
import { useResultData } from '../../../hooks/useResultData';
import styles from './ResultScreen.module.css';

export function ResultScreen() {
  const router = useRouter();

  const { scores, sessionScore, stamp, transactionId } = useResultData();

  const hasWon = sessionScore >= 100;
  const payoutAmount = hasWon ? 5 : 0;

  async function handlePayout(): Promise<void> {
    if (!hasWon) {
      router.push('/');
      return;
    }

    if (!transactionId) {
      console.log('No transaction id found');
      return;
    }

    try {
      await payoutTransaction(transactionId, {
        amount: payoutAmount,
      });

      router.push('/');
    } catch (error) {
      console.error('Payout failed:', error);
    }
  }

  return (
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
          <span>
            {typeof stamp === "string"
              ? stamp
              : JSON.stringify(stamp)}
          </span>
        ) : (
          <span>-</span>
        )}
        </div>
      </div>

      <div className={styles.hori}>
        <button className={styles.replay} onClick={() => router.push('/')}>
          Replay
        </button>

        <button className={styles.quit} onClick={handlePayout}>
          {hasWon ? 'Payout & Quit' : 'Quit'}
        </button>
      </div>
    </div>
  );
}