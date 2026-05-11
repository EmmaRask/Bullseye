'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import styles from './ResultScreen.module.css';

export function ResultScreen() {
  const router = useRouter();

  const [scores, setScores] = useState<Array<{ id: string; score: number; player_name: string }>>([]);

  useEffect(() => {
    const fetchScores = async () => {

      const playerName = localStorage.getItem("playerName");

      console.log("current player:", playerName);
      

      const { data, error } = await supabase
        .from('scores')
        .select('id, score, player_name')
        .order('score', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching scores:', error);
        return;
      }

      setScores(data || []);
    };

    fetchScores();
  }, []);


return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <section className={styles.titlePanel}>
          <h1>Scoreboard</h1>
        </section>

        <section className={styles.scorePanel}>
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className={`${styles.scoreRow} ${
                index === 4 ? styles.currentPlayerRow : ''
              }`}
            >
              <span>
                {index + 1}. {scores[index]?.player_name || '-'}
              </span>
              <span>{scores[index]?.score ?? '-'}</span>
            </div>
          ))}
        </section>

        <section className={styles.rewardPanel}>
          <p>5€</p>
          <div className={styles.stampCircle}></div>
        </section>

        <section className={styles.buttonPanel}>
          <button
            className={styles.playAgainButton}
            onClick={() => router.push('/')}
          >
            Play again
          </button>

          <button
            className={styles.exitButton}
            onClick={() => router.push('/')}
          >
            Payout & Exit
          </button>
        </section>
      </div>
    </main>
  );
}

