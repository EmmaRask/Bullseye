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

  return <div className={styles.pageWrapper}>
    <p className={styles.topSign}>High scores</p>
    <p className={styles.topSign}>Your score: </p>
    <div className={styles.top10}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div className={styles.scoreEntry} key={i}>
          #{i + 1} {scores[i]?.player_name || '-'} - {scores[i]?.score || '-'}
        </div>
      ))}
    </div>
    <div className={styles.rewards}></div>

    <div className={styles.hori}>
      <button
        className={styles.replay}
        onClick={() => router.push('/')}>
        Replay
      </button>

      <button
        className={styles.quit}
        onClick={() => router.push('/')}>
        Quit
      </button>
    </div>
  </div>;
}