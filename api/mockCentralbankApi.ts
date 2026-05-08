import type {
  TransactionRequest,
  TransactionResponse,
} from "./types";

function createMockId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function createMockStamp(): string {
  const animals = ["lion", "dolphin", "tucan", "beetlebug", "snake"];
  const metals = ["silver", "gold", "platinum"];

  const animal = animals[Math.floor(Math.random() * animals.length)];
  const hasMetal = Math.random() < 0.5;

  if (!hasMetal) {
    return animal;
  }

  const metal = metals[Math.floor(Math.random() * metals.length)];
  return `${metal} ${animal}`;
}

export async function mockCreateTransaction(
  transaction: TransactionRequest
): Promise<TransactionResponse> {
  return {
    uuid: createMockId(),
    seller: transaction.seller,
    buyer: transaction.buyer,
    amount: transaction.amount,
    stamp: createMockStamp(),
  };
}