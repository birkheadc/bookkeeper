import { Earning, Expense, ReportDictionary } from "./report";

export class ReportsSummary {

  total: number;
  average: number;
  earnings: (Earning & { average: number })[];
  expenses: (Expense & { average: number })[];

  constructor() {
    this.total = 1_000_000;
    this.average = 1_000_000;
    this.earnings = [];
    this.expenses = [];
  }

  static fromReportDictionary(reports: ReportDictionary): ReportsSummary {
    const summary = new ReportsSummary();



    return summary;
  }
}