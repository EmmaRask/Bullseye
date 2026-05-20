
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTransaction } from "../api/centralbankApi";
import { gameSession } from "../game/gameSession";

type UseStartGameReturn = {
  isLoading: boolean;
  errorMessage: string | null;
  handleStartGame: () => Promise<void>;
};

export function useStartGame(): UseStartGameReturn {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleStartGame(): Promise<void> {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const identityToken = sessionStorage.getItem("identity_token");

      if (!identityToken) {
        setErrorMessage("Missing identity token. Please enter through Tivoli.");
        return;
      }

      const transaction = await createTransaction({
        identity_token: identityToken,
        amount: 1,
      });

      if (!transaction.id) {
        setErrorMessage("Transaction failed. Please try again.");
        return;
      }

      gameSession.setTransaction(transaction);
      gameSession.startGame();

      router.push("/play");
    } catch (error) {
      console.error("Could not start game:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    errorMessage,
    handleStartGame,
  };
}