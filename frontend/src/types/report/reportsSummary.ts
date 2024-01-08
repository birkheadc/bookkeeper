import { ExtendedDate } from "../date/extendedDate";
import { Earning, Expense, ReportDictionary } from "./report";

export class ReportsSummary {

  total: number;
  average: number;
  earnings: (Earning & { average: number })[];
  expenses: (Omit<Expense, 'isIncludeInCash'> & { average: number })[];

  constructor() {
    this.total = 1_000_000;
    this.average = 1_000_000;
    this.earnings = [];
    this.expenses = [];
  }

  static fromReportDictionary(reports: ReportDictionary): ReportsSummary {
    const summary = new ReportsSummary();
    let numReportsForAverage = 0;
    let sum = 0;
    let allEarnings: (Earning & { average: number, num: number })[] = [];
    let allExpenses: (Omit<Expense, 'isIncludeInCash'> & { average: number, num: number })[] = [];

    Object.keys(reports).forEach(key => {
      const report = reports[key];
      if (isDateBeforeToday(report.date)) numReportsForAverage++;
      report.earnings.forEach(earning => {
        sum += earning.amount;
        const pre = allEarnings.find(e => e.category === earning.category);
        if (pre) {
          pre.amount += earning.amount;
          pre.num++;
          pre.average = Math.round(pre.amount / pre.num);
        } else {
          allEarnings.push({
            category: earning.category,
            amount: earning.amount,
            average: earning.amount,
            num: 1
          });
        }
      });
      report.expenses.forEach(expense => {
        if (expense.isIncludeInCash) {
          sum += expense.amount;
        }
        const pre = allExpenses.find(e => e.category === expense.category);
        if (pre) {
          pre.amount += expense.amount;
          pre.num++;
          pre.average = Math.round(pre.amount / pre.num);
        } else {
          allExpenses.push({
            category: expense.category,
            amount: expense.amount,
            average: expense.amount,
            num: 1
          })
        }
      });
    });

    summary.total = sum;
    summary.average = numReportsForAverage > 0 ? Math.round(sum / numReportsForAverage) : 0;
    summary.earnings = allEarnings;
    summary.expenses = allExpenses;

    return summary;
  }
}

function isDateBeforeToday(date: ExtendedDate): boolean {
  const today = new ExtendedDate();

  if (date.getFullYear() < today.getFullYear()) return true;
  if (date.getFullYear() > today.getFullYear()) return false;

  if (date.getMonth() < today.getMonth()) return true;
  if (date.getMonth() > today.getMonth()) return false;

  if (date.getDate() < today.getDate()) return true;
  return false;
}