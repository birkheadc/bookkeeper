import { BrowseViewMode } from "../browse/browseViewMode"
import { Currency } from "./currency"

export type UserSettings = {
  general: GeneralSettings,
  categories: TransactionCategorySettings,
  denominations: DenominationSettings
}

export type GeneralSettings = {
  currency: Currency,
  defaultViewMode: BrowseViewMode
}

export type TransactionCategorySettings = {
  earningCategories: EarningCategory[],
  expenseCategories: ExpenseCategory[]
}

export type EarningCategory = {
  name: string,
  isDefault: boolean
}

export type ExpenseCategory = EarningCategory & {
  subcategories?: string[]
}

export type DenominationSettings = {
  denominations: Denomination[]
}

export type Denomination = {
  value: number,
  isDefault: boolean
}