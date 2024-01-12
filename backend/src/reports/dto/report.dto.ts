import { Report } from "../entities/report.entity"

export class ReportDto {
  id: string;
  earnings: EarningDto[];
  expenses: ExpenseDto[];
}

export class EarningDto {
  id: string;
  reportDate: string
  category: string
  amount: number;
}

export class ExpenseDto extends EarningDto {
  subCategory?: string | undefined;
  isIncludeInCash: boolean;
  note?: string | undefined;
}