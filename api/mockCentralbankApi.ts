import type {
  FinishGameRequest,
  FinishGameResponse,
  StartGameResponse,
} from "./types";

// export async function mockStartGame(): Promise<StartGameResponse> {
//   return {
//     gameSessionId: crypto.randomUUID(),
//     entryFee: 5,
//     balanceAfterPayment: 20,
//   };
// }

export async function mockStartGame(): Promise<StartGameResponse> {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return {
    gameSessionId: id,
    entryFee: 5,
    balanceAfterPayment: 20,
  };
}

export async function mockFinishGame(
  result: FinishGameRequest
): Promise<FinishGameResponse> {
  const won = result.score >= 50;

  return {
    won,
    payout: won ? 10 : 0,
    stamp: {
      animal: "lion",
      metal: Math.random() < 0.5 ? "gold" : undefined,
    },
  };
}