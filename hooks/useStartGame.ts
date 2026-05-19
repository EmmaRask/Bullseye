import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTransaction } from "../api/centralbankApi";

type UseStartGameReturn = {
  playerName: string;
  setPlayerName: (name: string) => void;
  isLoading: boolean;
  errorMessage: string | null;
  handleStartGame: () => Promise<void>;
};

export function useStartGame(): UseStartGameReturn {
  const router = useRouter();

  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleStartGame(): Promise<void> {
    if (!playerName.trim()) {
      setErrorMessage("Please enter your first name before starting.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      localStorage.setItem("playerName", playerName.trim());

      const identityToken = localStorage.getItem("identity_token");

      if (!identityToken) {
      setErrorMessage("Missing identity token. Please enter through Tivoli.");
      return;
      }

    const transaction = await createTransaction({
      identity_token: identityToken,
      amount: 5,
      });

      // localStorage.setItem("playerName", playerName.trim());

      // const transaction = await createTransaction({
      //   identityToken: "mock-token",
      //   amount: 5,
      //   amusementUuid: "bullseye",
      // });

      localStorage.setItem("transaction", JSON.stringify(transaction));

      router.push("/play");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    playerName,
    setPlayerName,
    isLoading,
    errorMessage,
    handleStartGame,
  };
}