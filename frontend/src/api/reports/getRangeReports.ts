import { ExtendedDate } from "../../types/date/extendedDate";
import { Earning, Expense, Report } from "../../types/report/report";
import { Result } from "../../types/result/result";

export default async function getRangeReports(token: string | undefined, dates: ExtendedDate[]): Promise<Result<Report[]>> {
  if (token == null) return Result.Fail().WithMessage('Token invalid.');

  await new Promise((res, rej) => {
    setTimeout(() => {
      res('');
    }, 500);
  })
  const reports: Report[] = dates.map(d => generateDummyReport(d));
  return Result.Succeed().WithBody(reports);
}

function generateDummyReport(date: ExtendedDate): Report {
  const report = new Report();
  report.date = date;
  report.earnings = generateRandomEarnings();
  report.expenses = generateRandomExpenses();

  return report;
}

function generateRandomEarnings(): Earning[] {
  const num = Math.ceil(Math.random() * 3);

  const earnings: Earning[] = [];

  for (let i = 0; i < num; i++) {
    const earning: Earning = {
      category: EARNING_CATEGORIES[i],
      amount: (Math.floor(Math.random() * 1_000_000)) + 500_000
    }
    earnings.push(earning);
  }

  return earnings;
}

function generateRandomExpenses(): Expense[] {
  const num = Math.ceil(Math.random() * 3);

  const earnings: Expense[] = [];

  for (let i = 0; i < num; i++) {
    const expense: Expense = {
      category: EXPENSE_CATEGORIES[i],
      amount: (Math.floor(Math.random() * 1000000)) + 500000,
      isIncludeInCash: Math.round(Math.random()) === 1
    }
    earnings.push(expense);
  }

  return earnings;
}

const EARNING_CATEGORIES = ['cash', 'card', 'coupon'];
const EXPENSE_CATEGORIES = ['delivery', 'small change', 'lunch'];