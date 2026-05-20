
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

      console.log('Transaction response:', transaction);
      console.log('Transaction type:', typeof transaction);
      console.log('Transaction keys:', typeof transaction === 'object' ? Object.keys(transaction) : 'N/A');

      // The API returns either just the ID or an object with id property
      let transactionId = '';
      if (typeof transaction === 'object' && transaction !== null) {
        transactionId = (transaction as any).id ?? String(transaction);
      } else {
        transactionId = String(transaction);
      }
      
      console.log('Extracted transaction ID:', transactionId);
      
      // Store transaction ID for later retrieval (just the ID string, not JSON)
      localStorage.setItem("transaction", transactionId);
      gameSession.setTransaction(transactionId);

      router.push("/play");
    } catch {
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













// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { createTransaction } from "../api/centralbankApi";
// import { useIdentityToken } from "./useIdentityToken";
// import { useTivoliUser } from "./useTivoliUser";

// type UseStartGameReturn = {
//   playerName: string;
//   isLoading: boolean;
//   errorMessage: string | null;
//   handleStartGame: () => Promise<void>;
// };

// export function useStartGame(): UseStartGameReturn { useIdentityToken();

//   const router = useRouter();

//   const { playerName } = useTivoliUser();
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   async function handleStartGame(): Promise<void> {
//     if (!playerName.trim()) {
//       setErrorMessage("Please enter your first name before starting.");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setErrorMessage(null);

//       const identityToken = sessionStorage.getItem("identity_token");

//       if (!identityToken) {
//       setErrorMessage("Missing identity token. Please enter through Tivoli.");
//       return;
//       }

//     const transaction = await createTransaction({
//       identity_token: identityToken,
//       amount: 1,
//       });

//       // localStorage.setItem("playerName", playerName.trim());

//       // const transaction = await createTransaction({
//       //   identityToken: "mock-token",
//       //   amount: 5,
//       //   amusementUuid: "bullseye",
//       // });

//       localStorage.setItem("transaction", JSON.stringify(transaction));

//       router.push("/play");
//     } catch {
//       setErrorMessage("Something went wrong. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return {
//     playerName,
//     isLoading,
//     errorMessage,
//     handleStartGame,
//   };
// }