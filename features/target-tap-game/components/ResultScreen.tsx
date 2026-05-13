'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { payoutTransaction } from '../../../api/centralbankApi';

import styles from './ResultScreen.module.css';

type Score = {
  id: string;
  score: number;
  player_name: string;
};

type StoredTransaction = {
  transactionId: string;
  stamp: string;
};

export function ResultScreen() {
  const router = useRouter();

  const [scores, setScores] = useState<Score[]>([]);
  const [sessionScore, setSessionScore] = useState(0);

  /**
   * MOCK/TEMPORARY
   * Vi sparar stamp från mock-api tills riktiga Tivoli API:t finns.
   */
  const [stamp, setStamp] = useState('');

  /**
   * FRAMTIDA TIVOLI API
   * transactionId kommer behövas vid payout.
   */
  const [transactionId, setTransactionId] = useState('');

  const hasWon = sessionScore >= 100;
  const payoutAmount = hasWon ? 5 : 0;

  useEffect(() => {
    async function fetchScores() {
      /**
       * TEMPORARY
       * Hämtas just nu från localStorage.
       * Senare kommer namn komma från identity_token API:t.
       */
      const playerName = localStorage.getItem('playerName');

      /**
       * Session score från spelet.
       */
      const score = localStorage.getItem('sessionScore');

      /**
       * TEMPORARY MOCK TRANSACTION
       * Hämtar stamp + transactionId från mock api.
       */
      const storedTransaction = localStorage.getItem('transaction');

      if (storedTransaction) {
        const parsedTransaction: StoredTransaction =
          JSON.parse(storedTransaction);

        setStamp(parsedTransaction.stamp);
        setTransactionId(parsedTransaction.transactionId);
      }

      console.log('current player:', playerName);
      console.log('session score:', score);

      if (score) {
        setSessionScore(parseInt(score));
      }

      /**
       * LEADERBOARD
       * Hämtas från Supabase.
       */
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
    }

    fetchScores();
  }, []);

  /**
   * FRAMTIDA PAYOUT
   *
   * När riktiga Tivoli API:t finns:
   *
   * POST /transactions/{id}/payout
   *
   * Då används transactionId från createTransaction. Dubbelchecka! 
   */
  async function handlePayout() {
    if (!hasWon) {
      console.log('No payout, player did not win');
      router.push('/');
      return;
    }

    if (!transactionId) {
      console.log('No transaction id found');
      return;
    }

    try {
      /**
       * TEMPORARY MOCK PAYOUT PLZ funka nu
       */
      await payoutTransaction({
        transactionId,
        amount: payoutAmount,
      });

      console.log('Payout success');
      router.push('/');
    } catch (error) {
      console.error('Payout failed:', error);
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <p className={styles.topSign}>High scores</p>

      <p className={styles.topSign}>
        Your score: {sessionScore}
      </p>

      <div className={styles.top10}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div className={styles.scoreEntry} key={i}>
            #{i + 1} {scores[i]?.player_name || '-'} -{' '}
            {scores[i]?.score || '-'}
          </div>
        ))}
      </div>

      {/* TEMPORARY MOCK STAMP */}
      <div className={styles.rewards}>
        <p className={styles.payoutAmount}>
          {hasWon ? `${payoutAmount}€` : '0€'}
        </p>

        <div className={styles.stampCircle}>
          {stamp ? <span>{stamp}</span> : <span>-</span>}
        </div>
      </div>

      <div className={styles.hori}>
        <button
          className={styles.replay}
          onClick={() => router.push('/')}
        >
          Replay
        </button>

        <button
          className={styles.quit}
          onClick={handlePayout}
          disabled={!hasWon}
        >
          {hasWon ? 'Payout & Quit' : 'Quit'}
        </button>
      </div>
    </div>
  );
}
















// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabase';
// import { useRouter } from 'next/navigation';
// import styles from './ResultScreen.module.css';

// export function ResultScreen() {
//   const router = useRouter();

//   const [scores, setScores] = useState<Array<{ id: string; score: number; player_name: string }>>([]);
//   const [sessionScore, setSessionScore] = useState(0);

//   useEffect(() => {
//     const fetchScores = async () => {

//       const playerName = localStorage.getItem("playerName");
//       const score = localStorage.getItem("sessionScore");

//       console.log("current player:", playerName);
//       console.log("session score:", score);
      
//       if (score) {
//         setSessionScore(parseInt(score));
//       }
      

//       const { data, error } = await supabase
//         .from('scores')
//         .select('id, score, player_name')
//         .order('score', { ascending: false })
//         .limit(10);

//       if (error) {
//         console.error('Error fetching scores:', error);
//         return;
//       }

//       setScores(data || []);
//     };

//     fetchScores();
//   }, []);

//   return <div className={styles.pageWrapper}>
//     <p className={styles.topSign}>High scores</p>
//     <p className={styles.topSign}>Your score: {sessionScore}</p>
//     <div className={styles.top10}>
//       {Array.from({ length: 10 }).map((_, i) => (
//         <div className={styles.scoreEntry} key={i}>
//           #{i + 1} {scores[i]?.player_name || '-'} - {scores[i]?.score || '-'}
//         </div>
//       ))}
//     </div>
//     <div className={styles.rewards}></div>

//     <div className={styles.hori}>
//       <button
//         className={styles.replay}
//         onClick={() => router.push('/')}>
//         Replay
//       </button>

//       <button
//         className={styles.quit}
//         onClick={() => router.push('/')}>
//         Quit
//       </button>
//     </div>
//   </div>;
// }