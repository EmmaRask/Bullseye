import type {
  CreateTransactionRequest,
  CreateTransactionResponse,
  PayoutRequest,
  PayoutResponse,
} from "./types";

export async function createTransaction(
  transaction: CreateTransactionRequest
): Promise<CreateTransactionResponse> {
  const response = await fetch("/api/tivoli/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    throw new Error("Transaction failed");
  }

  return response.json();
}

export async function payoutTransaction(
  transactionId: number | string,
  payout: PayoutRequest
): Promise<PayoutResponse> {
  const response = await fetch(`/api/tivoli/transactions/${transactionId}/payout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payout),
  });

  if (!response.ok) {
    throw new Error("Payout failed");
  }

  return response.json();
}