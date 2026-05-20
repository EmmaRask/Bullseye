import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Score = {
  id: string;
  score: number;
  player_name: string;
};

type StoredTransaction = {
  id?: string;
  transactionId?: string;
  stamp: Stamp | string;
};

type Stamp = {
  id: number;
  user_id: number;
  stamptype_id: number;
  stamptype: {
    id: number;
    animal: string;
    metal: string | null;
    image_url: string;
  };
};

export function useResultData() {
  const [scores, setScores] = useState<Score[]>([]);
  const [sessionScore, setSessionScore] = useState(0);
  const [stamp, setStamp] = useState<string | Stamp>('');
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    async function fetchResultData() {
      const score = localStorage.getItem("sessionScore");
      const storedTransaction = localStorage.getItem("transaction");

      if (score) {
        setSessionScore(Number(score));
      }

      if (storedTransaction) {
        try {
          const parsedTransaction = JSON.parse(
            storedTransaction
          ) as StoredTransaction;

          console.log('Parsed transaction:', parsedTransaction);
          
          setStamp(parsedTransaction.stamp || '');
          const extractedId = parsedTransaction.id ?? parsedTransaction.transactionId ?? '';
          console.log('Extracted transaction ID:', extractedId);
          setTransactionId(extractedId);
        } catch (error) {
          console.error('Failed to parse transaction:', error);
        }
      }

      const { data, error } = await supabase
        .from("scores")
        .select("id, score, player_name")
        .order("score", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching scores:", error);
        return;
      }

      setScores(data || []);
    }

    fetchResultData();
  }, []);

  return {
    scores,
    sessionScore,
    stamp,
    transactionId,
  };
}