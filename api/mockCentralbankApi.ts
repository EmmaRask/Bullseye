import type {
  CreateTransactionRequest,
  CreateTransactionResponse,
  PayoutRequest,
  PayoutResponse,
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
  transaction: CreateTransactionRequest
): Promise<CreateTransactionResponse> {
  console.log("Mock transaction:", transaction);

  return {
    id: crypto.randomUUID(),
    stamp: "gold lion",

  };
}

export async function mockPayoutTransaction(
  payout: PayoutRequest
): Promise<PayoutResponse> {
  return {
    success: true,
  };
}