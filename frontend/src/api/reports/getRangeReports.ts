import { Earning, Expense, Report } from "../../types/report/report";
import { Result } from "../../types/result/result";

export default async function getRangeReports(dates: Date[]): Promise<Result<Report[]>> {
  await new Promise((res, rej) => {
    setTimeout(() => {
      res('');
    }, 2222);
  })
  const reports: Report[] = dates.map(d => generateDummyReport(d));
  return Result.Succeed().WithBody(reports);
}

function generateDummyReport(date: Date): Report {
  const earning: Earning = {
    category: "cash",
    amount: 500
  };
  const expense: Expense = {
    category: "taco bell",
    amount: 16,
    isIncludeInCash: false
  };
  const report: Report = {
    date: date,
    earnings: [ earning ],
    expenses: [ expense ]
  };
  return report;
}