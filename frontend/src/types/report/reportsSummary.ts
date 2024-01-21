import { ExtendedDate } from "../date/extendedDate";
import { Breakdown } from "../detail/breakdown";
import { Earning, EarningDto, Expense, ExpenseDto, Report } from "./report";

export class ReportsSummary {

  totalGross: number;
  averageGross: number;
  totalNet: number;
  averageNet: number;
  earnings: (Omit<EarningDto, 'id' | 'reportDate' > & { average: number })[];
  expenses: (Omit<ExpenseDto, 'isIncludeInCash' | 'id' | 'reportDate' > & { average: number })[];
  breakdown: Breakdown;

  constructor() {
    this.totalGross = 0;
    this.averageGross = 0;
    this.totalNet = 0;
    this.averageNet = 0;
    this.earnings = [];
    this.expenses = [];
    this.breakdown = new Breakdown();
  }

  static fromRecord(reports: Record<string, Report> | undefined): ReportsSummary {
    const summary = new ReportsSummary();
    if (reports == null) return summary;
    let numReportsForAverage = 0;
    let grossSum = 0;
    let expenseSum = 0;
    let allEarnings: (Omit<EarningDto, 'id' | 'reportDate'> & { average: number, num: number })[] = [];
    let allExpenses: (Omit<ExpenseDto, 'isIncludeInCash' | 'id' | 'reportDate' > & { average: number, num: number })[] = [];

    Object.keys(reports).forEach(key => {
      const report = reports[key];
      if (isDateBeforeToday(report.id)) numReportsForAverage++;
      report.earnings.forEach(earning => {
        summary.breakdown.addTransaction(earning);
        grossSum += earning.amount;
        const pre = allEarnings.find(e => e.category === earning.category);
        if (pre) {
          pre.amount += earning.amount;
          pre.num++;
          pre.average = pre.amount / pre.num;
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
        expenseSum += expense.amount;
        if (expense.isIncludeInCash) {
          grossSum += expense.amount;
        }
        const pre = allExpenses.find(e => e.category === expense.category);
        if (pre) {
          pre.amount += expense.amount;
          pre.num++;
          pre.average = pre.amount / pre.num;
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

    summary.totalGross = grossSum;
    summary.averageGross = numReportsForAverage > 0 ? grossSum / numReportsForAverage : 0;
    summary.totalNet = grossSum - expenseSum;
    summary.averageNet = numReportsForAverage > 0 ? (grossSum - expenseSum) / numReportsForAverage : 0;
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