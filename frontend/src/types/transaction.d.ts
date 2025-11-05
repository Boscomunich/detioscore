export interface Transaction {
  _id: string;
  amount: number;
  user: string;
  paymentMethod:
    | "card"
    | "transfer"
    | "googlepay"
    | "applepay"
    | "system"
    | "crypto";
  status: "pending" | "completed" | "failed";
  type: "topup" | "payout";
  createdAt: string;
  description?: string;
}

export {};
