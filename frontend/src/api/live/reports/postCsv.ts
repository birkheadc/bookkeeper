import config from "../../../config";
import { ExtendedDate } from "../../../types/date/extendedDate";
import { Earning, Expense, Report, ReportDto } from "../../../types/report/report";
import { Result } from "../../../types/result/result";
import helpers from "../../helpers";
import postBatchTransactions from "./postBatchTransactions";
import { v4 as uuidv4 } from 'uuid';


export default async function postCsv(token: string | undefined, file: File): Promise<Result> {
  if (token == null) return Result.Fail().WithMessage('session token not found');
  
  try {
    const transactions: { earnings: Earning[], expenses: Expense[] } = await parseFileForTransactions(file);
    return await postBatchTransactions(token, transactions);
  } catch {
    return Result.Fail().WithMessage('error processing file.');
  }
}

async function parseFileForTransactions(file: File): Promise<{ earnings: Earning[], expenses: Expense[] }> {
  const text = await file.text();
  const lines = text.split(/\r?\n/);

  const transactions: { earnings: Earning[], expenses: Expense[] } = { earnings: [], expenses: [] };

  lines.forEach(line => {
    if (line === '') return;
    const parameters = line.split(',');

    const date = parseDate(parameters[0]);
    const categoryName = parameters[1];
    const amount = Math.abs(parseInt(parameters[2]));

    if (parameters.length === 3) {
      const earning: Earning = new Earning();
      earning.id = uuidv4();
      earning.reportDate = date;
      earning.category = categoryName.toLowerCase().trim();
      earning.amount = amount;

      transactions.earnings.push(earning);

      return;
    }
    const note = parameters[3];
    const isIncludeInCash = parameters[4].toLowerCase() === 'true';
    const subCategory = categoryName === 'stock' ? note.toLowerCase().trim() : '';

    const expense: Expense = new Expense();
    expense.id = uuidv4();
    expense.reportDate = date;
    expense.category = categoryName.toLowerCase().trim();
    expense.amount = amount;
    expense.isIncludeInCash = isIncludeInCash;
    expense.subCategory = subCategory.toLowerCase().trim();
    expense.note = note;

    transactions.expenses.push(expense);
  });

  return transactions;
}

function parseDate(s: string): ExtendedDate {
  const [ month, day, year ] = s.split('/');
  const date = new ExtendedDate();
  date.setMonth(parseInt(month) - 1);
  date.setDate(parseInt(day));
  date.setFullYear(parseInt(year));
  return date;
}

// export default async function postCsv(token: string | undefined, file: File): Promise<Result> {
//   if (token == null) return Result.Fail().WithMessage('session token not found');
//   const url = config.api.reports.url + '/upload-csv';
//   const { signal, timeout } = helpers.getAbortSignal();
//   const formData = new FormData();
//   formData.append('file', file);
//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//       body: formData,
//       signal: signal
//     });
//     if (!response.ok) return Result.Fail().WithMessage('server refused request');
//     return Result.Succeed();
//   } catch {
//     return Result.Fail().WithMessage('unable to connect to server');
//   } finally {
//     clearTimeout(timeout);
//   }
// }