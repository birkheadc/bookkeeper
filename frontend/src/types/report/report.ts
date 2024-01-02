import { ExtendedDate } from "../date/extendedDate"

export class Report {
  date: ExtendedDate;
  earnings: Earning[];
  expenses: Expense[];
  constructor() {
    this.date = new ExtendedDate();
    this.earnings = [];
    this.expenses = [];
  }

  getTotalEarnings(): number {
    let sum = 0;
    this.earnings.forEach(earning => {
      sum += earning.amount;
    });
    this.expenses.forEach(expense => {
      if (expense.isIncludeInCash) {
        sum += expense.amount;
      }
    });
    return sum;
  }
}

export type Earning = {
  category: string,
  amount: number
}

export type Expense = {
  category: string,
  subCategory?: string | undefined,
  amount: number,
  isIncludeInCash: boolean,
  note?: string | undefined
}

export type ReportDictionary = {
  [ key: string ]: Report
}