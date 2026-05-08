'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function ResultScreen() {
  useEffect(() => {
    const fetchScores = async () => {
      const { data, error } = await supabase
        .from('scores')
        .select('*');

      console.log('scores:', data);
    };

    fetchScores();
  }, []);

  return <div>Result page</div>;
}