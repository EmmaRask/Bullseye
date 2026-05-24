import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { gameSession } from "@/game/gameSession";

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
      const playerName = sessionStorage.getItem("player_name") ?? "Unknown";
      const transactionId = gameSession.getTransaction();

      sessionStorage.setItem("sessionScore", sessionScore.toString());

      if (!transactionId) {
        console.error("Missing transaction id when saving score");
      } else {
        const response = await fetch("/api/scores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            player_name: playerName,
            score: sessionScore,
            transaction_id: transactionId,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("Error saving score:", error);
        }
      }

      setTimeout(() => {
        router.push("/result");
      }, 2000);
    }

    saveScoreAndRedirect();
  }, [gameOver, sessionScore, router]);
}