import { BrowseViewMode } from "../browse/browseViewMode"
import { Currency } from "./currency"

export class UserSettings {
  general: GeneralSettings = {
    currency: Currency.USD,
    defaultViewMode: BrowseViewMode.DAY
  };
  categories: TransactionCategorySettings = {
    earnings: [],
    expenses: []
  };
  denominations: DenominationSettings = {
    denominations: []
  };

  static fromJson(json: any): UserSettings {
    const settings = new UserSettings();

    settings.general.currency = json.general?.currency ?? Currency.USD;
    settings.general.defaultViewMode = json.general?.defaultViewMode ?? BrowseViewMode.DAY;

    settings.categories.earnings = json.categories?.earnings ?? [];
    settings.categories.expenses = json.categories?.expenses ?? [];

    settings.denominations.denominations = json.denominations?.denominations ?? [];

    return settings;
  }
  
  static toDto(settings: UserSettings): UserSettingsDto {
    const dto: UserSettingsDto = {
      general: {
        currency: settings.general.currency,
        defaultViewMode: settings.general.defaultViewMode
      },
      categories: {
        earnings: settings.categories.earnings,
        expenses: settings.categories.expenses
      },
      denominations: {
        denominations: settings.denominations.denominations
      }
    };

    return dto;
  }
}

export type GeneralSettings = {
  currency: Currency,
  defaultViewMode: BrowseViewMode
}

export type TransactionCategorySettings = {
  earnings: EarningCategory[],
  expenses: ExpenseCategory[]
}

export type EarningCategory = {
  name: string,
  isDefault: boolean
}

export type ExpenseCategory = EarningCategory & {
  subCategories?: string[]
}

export type DenominationSettings = {
  denominations: Denomination[]
}

export type Denomination = {
  value: number,
  isDefault: boolean
}

export type UserSettingsDto = {
  general: {
    currency: string,
    defaultViewMode: string
  },
  categories: {
    earnings: EarningCategory[],
    expenses: ExpenseCategory[]
  },
  denominations: {
    denominations: Denomination[]
  }
}