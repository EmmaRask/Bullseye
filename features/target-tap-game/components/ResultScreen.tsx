'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function ResultScreen() {
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

  return <>
    <h1>High scores</h1>
    <p>Your score: </p>
    <div className='top10'>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i}>
          #{i + 1} {scores[i]?.player_name || '-'} - {scores[i]?.score || '-'}
        </div>
      ))}
    </div>
    <div className='rewards'></div>
    <button className='replay'>Replay</button>
    <button className='quit'>Quit</button>
  </>;
}