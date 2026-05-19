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

export type CreateTransactionResponse = {
  id: string;
  stamp: string;
};

export type PayoutRequest = {
  amount: number;
};

export type PayoutResponse = {
  success?: boolean;
};

