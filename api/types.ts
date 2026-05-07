export interface StartGameResponse {
  readonly gameSessionId: string;
  readonly entryFee: number;
  readonly balanceAfterPayment: number;
}

export interface FinishGameRequest {
  readonly gameSessionId: string;
  readonly score: number;
}

export interface FinishGameResponse {
  readonly won: boolean;
  readonly payout: number;
  readonly stamp: {
    readonly animal: "lion" | "dolphin" | "tucan" | "beetlebug" | "snake";
    readonly metal?: "silver" | "gold" | "platinum";
  };
}