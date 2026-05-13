
export type CreateTransactionRequest = {
  identityToken: string;
  amount: number;
  amusementUuid: string;
};

export type TransactionResponse = {
  transactionId: string;
  stamp: string;
};

export type PayoutRequest = {
  transactionId: string;
  amount: number;
};

export type PayoutResponse = {
  sucess: boolean;
};