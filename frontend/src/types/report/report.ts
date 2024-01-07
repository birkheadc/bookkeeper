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

  static getTotalEarnings(report: Report): number {
    let sum = 0;
    report.earnings.forEach(earning => {
      sum += earning.amount;
    });
    report.expenses.forEach(expense => {
      if (expense.isIncludeInCash) {
        sum += expense.amount;
      }
    });
    return sum;
  }

  static fromDto(dto: ReportDto): Report {
    const report = new Report();

    report.date = new ExtendedDate(dto.date);
    report.earnings = dto.earnings;
    report.expenses = dto.expenses;

    return report;
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

export class ReportDto {
  date: number = 0;
  earnings: Earning[] = [];
  expenses: Expense[] = [];

  static fromReport(report: Report): ReportDto {
    const dto = new ReportDto();

    dto.date = report.date.valueOf();
    dto.earnings = report.earnings;
    dto.expenses = report.expenses;

    return dto;
  }
}