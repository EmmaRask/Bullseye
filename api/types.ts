
export type TransactionRequest = {
  seller: string;
  buyer: string;
  amount: number;
};

export type TransactionResponse = {
  uuid: string;
  seller: string;
  buyer: string;
  amount: number;
  stamp: string;
};