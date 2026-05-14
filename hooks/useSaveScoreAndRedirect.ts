import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Params = {
  gameOver: boolean;
  sessionScore: number;
};

export function useSaveScoreAndRedirect({
  gameOver,
  sessionScore,
}: Params): void {
  const router = useRouter();

  useEffect(() => {
    if (!gameOver) return;

    async function saveScoreAndRedirect(): Promise<void> {
      const playerName = localStorage.getItem("playerName") ?? "Unknown";
      localStorage.setItem("sessionScore", sessionScore.toString());

      const { error } = await supabase.from("scores").insert([
        {
          player_name: playerName,
          score: sessionScore,
        },
      ]);

      if (error) {
        console.error("Error saving score:", error);
      }

      setTimeout(() => {
        router.push("/result");
      }, 2000);
    }

    saveScoreAndRedirect();
  }, [gameOver, sessionScore, router]);
}