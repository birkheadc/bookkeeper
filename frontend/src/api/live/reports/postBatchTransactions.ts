import { report } from "process";
import config from "../../../config";
import { Earning, Expense } from "../../../types/report/report";
import { Result } from "../../../types/result/result";
import helpers from "../../helpers";

export default async function postBatchTransactions(token: string | undefined, transactions: { earnings: Earning[], expenses: Expense[] }): Promise<Result> {
  if (token == null) return Result.Fail().WithMessage('session token not found');

  const url = config.api.reports.url + '/put-transactions';
  const { signal, timeout } = helpers.getAbortSignal();

  const request = { earnings: transactions.earnings.map(e => e.toDto()), expenses: transactions.expenses.map(e => e.toDto()) };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request),
      signal: signal
    });
    if (!response.ok) return Result.Fail().WithMessage('request was denied by server');
    return Result.Succeed().WithMessage('success');
  } catch {
    return Result.Fail().WithMessage('unable to connect to server');
  } finally {
    clearTimeout(timeout);
  }
}