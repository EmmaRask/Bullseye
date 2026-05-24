
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Score = {
  id: string;
  score: number;
  player_name: string;
};

type Stamp = {
  animal: string;
  metal: string | null;
  image_url: string;
};

type StoredTransaction = {
  transaction_id: number;
  amount: number;
  stamp: Stamp | null;
};

export function useResultData() {
  const [scores, setScores] = useState<Score[]>([]);
  const [sessionScore, setSessionScore] = useState(0);
  const [stamp, setStamp] = useState<string | Stamp>("");
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    async function fetchResultData() {
      const score = sessionStorage.getItem("sessionScore");
      const storedTransaction = sessionStorage.getItem("transaction");

      if (score) {
        setSessionScore(Number(score));
      }

      if (storedTransaction) {
        try {
          const transaction: StoredTransaction = JSON.parse(storedTransaction);

          setTransactionId(String(transaction.transaction_id));

          if (transaction.stamp) {
            setStamp(transaction.stamp);
          }
        } catch (error) {
          console.error("Could not parse stored transaction:", error);
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