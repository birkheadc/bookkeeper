import { AttributeValue } from "@aws-sdk/client-dynamodb";

export class Report {
  id: string;
  earnings: Earning[] = [];
  expenses: Expense[] = [];

  static fromAttributeValues(values: Record<string, AttributeValue>): Report {
    const report = new Report();

    report.id = values.id?.S ?? '';
    
    const earnings: Earning[] = values.earnings?.L?.flatMap(l => l.M ? Earning.fromAttributeValues(l.M) : []) ?? [];
    const expenses: Expense[] = values.expenses?.L?.flatMap(l => l.M ? Expense.fromAttributeValues(l.M) : []) ?? [];

    report.earnings = earnings;
    report.expenses = expenses;

    return report;
  }

  static emptyWithDate(date: string): Report {
    const report = new Report();
    report.id = date;
    return report;
  }
}

export class Transaction {
  id: string;
  reportDate: string;
  category: string;
  amount: number;
}

export class Earning extends Transaction {
  static fromAttributeValues(values: Record<string, AttributeValue>): Earning {
    const earning = new Earning();

    earning.id = values.id?.S ?? '';
    earning.reportDate = values.reportDate?.S ?? '';
    earning.category = values.category?.S ?? '';
    earning.amount = parseInt(values.amount?.N ?? '0');

    return earning;
  }
}

export class Expense extends Transaction {
  subCategory?: string | undefined;
  isIncludeInCash?: boolean;
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
}