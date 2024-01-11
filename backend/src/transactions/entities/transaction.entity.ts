export class Transaction {
  id: string;
  date: number;
  category: string;
  subCategory?: string | undefined;
  amount: number;
  isIncludeInCash?: boolean;
  note?: string | undefined;
}