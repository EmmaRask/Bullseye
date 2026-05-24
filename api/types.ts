export type IdentityTokenResponse = {
  user: {
    id: string;
    name: string;
  };
  expires_at: string;
};

export type CreateTransactionRequest = {
  identity_token: string;
  amount: number;
};

export type Stamp = {
  animal: string;
  metal: string | null;
  image_url: string;
};

export type CreateTransactionResponse = {
  transaction_id: number;
  amount: number;
  stamp: Stamp | null;
};

export type PayoutRequest = {
  amount: number;
};

export type PayoutResponse = {
  transaction_id: number;
  amount: number;
};