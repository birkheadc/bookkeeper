import { ExtendedDate, ExtendedDateDto } from "../date/extendedDate"

export class Report {
  id: ExtendedDate;
  earnings: Earning[];
  expenses: Expense[];
  constructor() {
    this.id = new ExtendedDate();
    this.earnings = [];
    this.expenses = [];
  }
  
  copy(): Report {
    return Report.fromDto(this.toDto());
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

  static fromDto(dto: ReportDto): Report {
    const report = new Report();

    report.id = ExtendedDate.fromDto(dto.id);
    report.earnings = dto.earnings.map(dto => Earning.fromDto(dto));
    report.expenses = dto.expenses.map(dto => Expense.fromDto(dto));

    return report;
  }

  toDto(): ReportDto {
    const request: ReportDto = {
      id: this.id.toDto(),
      earnings: this.earnings.map(e => e.toDto()),
      expenses: this.expenses.map(e => e.toDto())
    }

    return request;
  }

  static fromRecord(record: Record<string, Report>): Report[] {
    return Object.keys(record).map(key => record[key]).sort((a, b) => { return a.id.valueOf() - b.id.valueOf()});
  }

  static toRecord(reports: Report[]): Record<string, Report> {
    const record: Record<string, Report> = {};
    reports.forEach(report => {
      record[report.id.toDto()] = report;
    })
    return record;
  }

  static fromJson(json: any): Report[] {
    return json.map((d: any) => {
      const report = new Report()

      report.id = ExtendedDate.fromDto(d.id);
      
      report.earnings = d.earnings?.map((dto: any) => Earning.fromDto(dto)) ?? [];
      report.expenses = d.expenses?.map((dto: any) => Expense.fromDto(dto)) ?? [];

      return report;
    });
  }
}

export class Earning {
  id: string = '';
  reportDate: ExtendedDate = new ExtendedDate();
  category: string = '';
  amount: number = 0;

  copy(): Earning {
    return Earning.fromDto(this.toDto());
    // const earning = new Earning;
    // earning.id = this.id;
    // earning.reportDate = this.reportDate;
    // earning.category = this.category;
    // earning.amount = this.amount;
    // return earning;
  }

  static fromDto(dto: EarningDto): Earning {
    const earning = new Earning();

    earning.id = dto.id;
    earning.reportDate = ExtendedDate.fromDto(dto.reportDate);
    earning.category = dto.category;
    earning.amount = dto.amount;

    return earning;
  }

  toDto(): EarningDto {
    const dto = new EarningDto();

    dto.id = this.id;
    dto.reportDate = this.reportDate.toDto();
    dto.category = this.category;
    dto.amount = this.amount;

    return dto;
  }
}

export class Expense extends Earning {
  subCategory?: string | undefined;
  isIncludeInCash: boolean = false;
  note?: string | undefined;

  copy(): Expense {
    return Expense.fromDto(this.toDto());
    // const expense = new Expense;
    // expense.id = this.id;
    // expense.reportDate = this.reportDate;
    // expense.category = this.category;
    // expense.amount = this.amount;
    // expense.subCategory = this.subCategory;
    // expense.isIncludeInCash = this.isIncludeInCash;
    // expense.note = this.note;
    // return expense;
  }

  static fromDto(dto: ExpenseDto): Expense {
    const expense = new Expense();

    expense.id = dto.id;
    expense.reportDate = ExtendedDate.fromDto(dto.reportDate);
    expense.category = dto.category;
    expense.amount = dto.amount;
    expense.subCategory = (dto.subCategory == null || dto.subCategory === '') ? undefined : dto.subCategory;
    expense.isIncludeInCash = dto.isIncludeInCash;
    expense.note = dto.note;

    return expense;
  }

  toDto(): ExpenseDto {
    const dto = new ExpenseDto();

    dto.id = this.id;
    dto.reportDate = this.reportDate.toDto();
    dto.category = this.category;
    dto.amount = this.amount;
    dto.subCategory = this.subCategory;
    dto.isIncludeInCash = this.isIncludeInCash;
    dto.note = this.note;

    return dto;
  }
}

export class EarningDto {
  id: string = '';
  reportDate: string = '';
  category: string = '';
  amount: number = 0;
}

export class ExpenseDto extends EarningDto {
  subCategory?: string | undefined;
  isIncludeInCash: boolean = false;
  note?: string | undefined;
}

export class ReportDto {
  id: ExtendedDateDto = new ExtendedDate().toDto();
  earnings: EarningDto[] = [];
  expenses: ExpenseDto[] = [];
} 