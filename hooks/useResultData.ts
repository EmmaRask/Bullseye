import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Score = {
  id: string;
  score: number;
  player_name: string;
};

type StoredTransaction = {
  transactionId: string;
  stamp: string;
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
        const parsedTransaction = JSON.parse(
          storedTransaction
        ) as StoredTransaction;

        setStamp(parsedTransaction.stamp);
        setTransactionId(parsedTransaction.transactionId);
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