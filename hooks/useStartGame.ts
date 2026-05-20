
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
      if (typeof transaction === 'object' && transaction !== null && 'id' in transaction) {
        // It's an object with an id property
        transactionId = String((transaction as any).id);
      } else if (typeof transaction === 'object' && transaction !== null) {
        // It's an object but no id property - this shouldn't happen
        console.error('Transaction is object but has no id property', transaction);
        setErrorMessage('Transaction failed - invalid response format');
        return;
      } else {
        // It's a primitive (string or number)
        transactionId = String(transaction);
      }
      
      if (!transactionId) {
        console.error('Failed to extract transaction ID');
        setErrorMessage('Transaction failed - could not extract ID');
        return;
      }
      
      console.log('Extracted transaction ID:', transactionId, 'Type:', typeof transactionId);
      
      // Store transaction ID for later retrieval (just the ID string, not JSON)
      // Double-check it's actually a string before storing
      const toStore = String(transactionId);
      console.log('About to store:', toStore, 'Type:', typeof toStore);
      localStorage.setItem("transaction", toStore);
      gameSession.setTransaction(toStore);

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