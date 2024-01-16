import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { EarningDto, ExpenseDto, ReportDto } from "../dto/report.dto";

export class Report {
  id: string;
  earnings: Earning[] = [];
  expenses: Expense[] = [];

  static emptyWithDate(date: string): Report {
    const report = new Report();
    report.id = date;
    return report;
  }

  static fromAttributeValues(values: Record<string, AttributeValue>): Report {
    const report = new Report();

    report.id = values.id?.S ?? '';
    
    const earnings: Earning[] = values.earnings?.L?.flatMap(l => l.M ? Earning.fromAttributeValues(l.M) : []) ?? [];
    const expenses: Expense[] = values.expenses?.L?.flatMap(l => l.M ? Expense.fromAttributeValues(l.M) : []) ?? [];

    report.earnings = earnings;
    report.expenses = expenses;

    return report;
  }

  toAttributeValues(): Record<string, AttributeValue> {
    const values = {
      id: { "S": this.id },
      earnings: { "L": this.earnings.map(e => ({ "M": e.toAttributeValues() })) },
      expenses: { "L": this.expenses.map(e => ({ "M": e.toAttributeValues() })) }
    };

    return values;
  }

  static fromDto(dto: ReportDto): Report {
    const report = new Report();

    report.id = dto.id;
    report.earnings = dto.earnings.map(dto => Earning.fromDto(dto));
    report.expenses = dto.expenses.map(dto => Expense.fromDto(dto));

    return report;
  }

  toDto(): ReportDto {
    const dto = new ReportDto();

    dto.id = this.id;
    dto.earnings = this.earnings.map(e => e.toDto());
    dto.expenses = this.expenses.map(e => e.toDto());

    return dto;
  }
}

export class Earning {
  id: string;
  reportDate: string;
  category: string;
  amount: number;

  static fromAttributeValues(values: Record<string, AttributeValue>): Earning {
    const earning = new Earning();

    earning.id = values.id?.S ?? '';
    earning.reportDate = values.reportDate?.S ?? '';
    earning.category = values.category?.S ?? '';
    earning.amount = parseInt(values.amount?.N ?? '0');

    return earning;
  }

  toAttributeValues(): Record<string, AttributeValue> {
    const values = {
      id: { "S": this.id },
      reportDate: { "S": this.reportDate },
      category: { "S": this.category.toLowerCase() },
      amount: { "N": this.amount.toString() }
    };
    return values;
  }

  static fromDto(dto: EarningDto): Earning {
    const earning = new Earning();

    earning.id = dto.id;
    earning.reportDate = dto.reportDate;
    earning.amount = dto.amount;
    earning.category = dto.category;

    return earning;
  }

  toDto(): EarningDto {
    const dto = new EarningDto();

    dto.id = this.id;
    dto.reportDate = this.reportDate;
    dto.category = this.category;
    dto.amount = this.amount;

    return dto;
  }
}

export class Expense extends Earning {
  subCategory?: string | undefined;
  isIncludeInCash: boolean;
  note?: string | undefined;

  static fromAttributeValues(values: Record<string, AttributeValue>): Expense {
    const expense = new Expense();

    expense.id = values.id?.S ?? '';
    expense.reportDate = values.reportDate?.S ?? '';
    expense.category = values.category?.S ?? '';
    expense.subCategory = values.subCategory?.S ?? '';
    expense.amount = parseInt(values.amount?.N ?? '0');
    expense.isIncludeInCash = values.isIncludeInCash?.BOOL ?? false;
    expense.note = values.note?.S ?? '';

    return expense;
  }

  toAttributeValues(): Record<string, AttributeValue> {
    const values: Record<string, AttributeValue> = {
      id: { "S": this.id },
      reportDate: { "S": this.reportDate },
      category: { "S": this.category.toLowerCase() },
      amount: { "N": this.amount.toString() },
      isIncludeInCash: { "BOOL": this.isIncludeInCash }
    };
    if (this.subCategory) values.subCategory = { "S": this.subCategory.toLowerCase() };
    if (this.note) values.note = { "S": this.note };
    return values;
  }

  static fromDto(dto: ExpenseDto): Expense {
    const expense = new Expense();

    expense.id = dto.id;
    expense.reportDate = dto.reportDate;
    expense.category = dto.category;
    expense.amount = dto.amount;
    expense.subCategory = dto.subCategory;
    expense.isIncludeInCash = dto.isIncludeInCash;
    expense.note = dto.note;

    return expense;
  }

  toDto(): ExpenseDto {
    const dto = new ExpenseDto();

    dto.id = this.id;
    dto.reportDate = this.reportDate;
    dto.category = this.category;
    dto.amount = this.amount;
    dto.subCategory = this.subCategory;
    dto.isIncludeInCash = this.isIncludeInCash;
    dto.note = this.note;

    return dto;
  }
}