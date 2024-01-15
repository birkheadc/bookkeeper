export class SettingsDto {
  general: GeneralSettings;
  categories: TransactionCategorySettings;
  denominations: DenominationSettings
}

type GeneralSettings = {
  currency: string,
  defaultViewMode: string
}

type TransactionCategorySettings = {
  earnings: EarningCategory[],
  expenses: ExpenseCategory[]
}

type EarningCategory = {
  name: string,
  isDefault: boolean
}

type ExpenseCategory = EarningCategory & {
  subCategories?: string[] | undefined
}

type DenominationSettings = {
  denominations: Denomination[]
}

type Denomination = {
  value: number,
  isDefault: boolean
}