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
      const playerName =
        sessionStorage.getItem("player_name") ?? "Unknown";

      sessionStorage.setItem(
        "sessionScore",
        sessionScore.toString()
      );

      console.log('Score saved to sessionStorage:', sessionScore);

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