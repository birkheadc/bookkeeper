import { BrowseViewMode } from "../browse/browseViewMode"

export type UserSettings = {
  general: GeneralSettings,
  categories: TransactionCategorySettings,
  denominations: DenominationSettings
}

export type GeneralSettings = {
  defaultViewMode: BrowseViewMode
}

export type TransactionCategorySettings = {
  earningCategories: TransactionCategory[],
  expenseCategories: TransactionCategory[]
}

export type TransactionCategory = {
  name: string,
  isDefault: boolean
}

export type DenominationSettings = {
  denominations: Denomination[]
}

export type Denomination = {
  value: number,
  isDefault: boolean
}