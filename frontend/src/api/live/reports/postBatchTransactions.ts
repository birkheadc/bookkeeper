import { Earning, Expense } from "../../../types/report/report";
import { Result } from "../../../types/result/result";

export default async function postBatchTransactions(token: string | undefined, transactions: { earnings: Earning[], expenses: Expense[] }): Promise<Result> {
  return Result.Fail().WithMessage('Not yet implemented.');
}