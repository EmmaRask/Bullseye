'use client';

/**
 * Result screen for completed game session.
 * Uses Tivoli transaction id for payout when the player wins.
 */

import { payoutTransaction } from '../../../api/centralbankApi';
import { useResultData } from '../../../hooks/useResultData';
import { gameSession } from '../../../game/gameSession';
import { GameSessionModal } from './GameSessionModal';
import styles from './ResultScreen.module.css';

const TIVOLI_FRONTEND_URL = 'https://frontend-main-1ac7.up.railway.app';

export function ResultScreen() {
  const { scores, sessionScore, stamp, transactionId } = useResultData();

  const hasWon = sessionScore >= 100;
  const payoutAmount = hasWon ? 5 : 0;

  async function handlePayout(): Promise<void> {
    if (!hasWon) {
      gameSession.reset();
      window.location.href = TIVOLI_FRONTEND_URL;
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

      gameSession.reset();
      window.location.href = TIVOLI_FRONTEND_URL;
    } catch (error) {
      console.error('Payout failed:', error);
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
              src={stamp.stamptype.image_url}
              alt={`${stamp.stamptype.metal ?? ''} ${stamp.stamptype.animal}`}
              className={styles.stampImage}
            />

           <span>
            {stamp.stamptype.metal
              ? `${stamp.stamptype.metal} `
              : ''}
            {stamp.stamptype.animal}
          </span>
            </>
          )
        ) : (
          <span>-</span>
        )}
      </div>
      </div>

      <div className={styles.hori}>
        <button className={styles.quit} onClick={handlePayout}>
          {hasWon ? 'Payout & Quit' : 'Quit'}
        </button>
      </div>
      </div>
    </>
  );
}