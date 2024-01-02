export type Report = {
  date: Date,
  earnings: Earning[],
  expenses: Expense[]
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