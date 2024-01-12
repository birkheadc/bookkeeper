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

  static fromReportDictionary(dict: ReportDictionary): Report[] {
    return Object.keys(dict).map(key => dict[key]).sort((a, b) => { return a.date.valueOf() - b.date.valueOf()});
  }

  static toDictionary(reports: Report[]): ReportDictionary {
    const dict: ReportDictionary = {};
    reports.forEach(report => {
      dict[report.date.toSimpleString()] = report;
    })
    return dict;
  }

  static fromServerData(data: any): Report[] {
    return data.map((d: any) => {
      const report = new Report()

      report.date = ExtendedDate.fromDatabaseDate(d.id);
      
      report.earnings = d.earnings ?? [];
      report.expenses = d.expenses ?? [];

      return report;
    });
  }
}

export type Earning = {
  id: string,
  date: ExtendedDate,
  category: string,
  amount: number
}

export type Expense = {
  id: string,
  date: ExtendedDate,
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
  date: string = new ExtendedDate().toSimpleString();
  earnings: Earning[] = [];
  expenses: Expense[] = [];

  static fromReport(report: Report): ReportDto {
    const dto = new ReportDto();

    dto.date = report.date.toSimpleString();
    dto.earnings = report.earnings;
    dto.expenses = report.expenses;

    return dto;
  }
}