import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { SettingsDto } from "../dto/settings.dto";

export class Settings {
  general: GeneralSettings = {
    currency: "",
    defaultViewMode: ""
  };
  categories: TransactionCategorySettings = {
    earnings: [],
    expenses: []
  };
  denominations: DenominationSettings = {
    denominations: []
  };

  static default: Settings = this.fromDto({ general: { currency: 'USD', defaultViewMode: 'day' } });

  static fromDto(dto: Partial<SettingsDto>): Settings {
    const settings = new Settings();

    settings.general.currency = dto?.general?.currency ?? '';
    settings.general.defaultViewMode = dto?.general?.defaultViewMode ?? '';

    settings.categories.earnings = dto?.categories?.earnings ?? [];
    settings.categories.expenses = dto?.categories?.expenses?.map(e => ({...e, subCategories: e.subCategories ?? []})) ?? [];

    settings.denominations.denominations = dto?.denominations?.denominations ?? [];

    return settings;
  }

  toDto(): SettingsDto {
    const dto = new SettingsDto();

    dto.general = this.general;
    dto.categories = this.categories;
    dto.denominations = this.denominations;

    return dto;
  }

  static fromAttributeValues(values: Record<string, AttributeValue>): Settings {
    const settingValues = values.settings.M;
    const settings = new Settings();
    if (settingValues == null) return settings;

    settings.general.currency = settingValues.general?.M?.currency?.S ?? '';
    settings.general.defaultViewMode = settingValues.general?.M?.defaultViewMode?.S ?? '';
    
    settings.categories.earnings = settingValues.categories?.M?.earnings?.L?.map((av: AttributeValue) => ({
      name: av.M?.name?.S ?? '',
      isDefault: av.M?.isDefault?.BOOL ?? false
    })) ?? [];
    settings.categories.expenses = settingValues.categories?.M?.expenses?.L?.map((av: AttributeValue) => ({
      name: av.M?.name?.S ?? '',
      isDefault: av.M?.isDefault?.BOOL ?? false,
      subCategories: av.M?.subCategories?.L?.map((_av: AttributeValue) => (
        _av.S ?? ''
      )) ?? []
    })) ?? [];;

    settings.denominations.denominations = settingValues.denominations?.M?.denominations?.L?.map((av: AttributeValue) => ({
      value: parseInt(av.M?.value.N ?? '0'),
      isDefault: av.M?.isDefault?.BOOL ?? false
    })) ?? [];

    return settings;
  }

  toAttributeValue(): AttributeValue {
    return {
      "M": {
        "general": {
          "M": {
            "currency": { "S": this.general.currency },
            "defaultViewMode": { "S": this.general.defaultViewMode }
          }
        },
        "categories": {
          "M": {
            "earnings": {
              "L": this.categories.earnings.map(e => ({
                "M": {
                  "name": { "S": e.name.toLowerCase()},
                  "isDefault": { "BOOL": e.isDefault }
                }
              }))
            },
            "expenses": {
              "L": this.categories.expenses.map(e => ({
                "M": {
                  "name": { "S": e.name.toLowerCase()},
                  "isDefault": { "BOOL": e.isDefault },
                  "subCategories": {
                    "L": e.subCategories?.map(s => ({ "S": s})) ?? []
                  }
                }
              }))
            }
          }
        },
        "denominations": {
          "M": {
            "denominations": {
              "L": this.denominations.denominations.map(d =>({
                "M": {
                  "value": { "N": d.value.toString() },
                  "isDefault": { "BOOL": d.isDefault }
                }
              }))
            }
          }
        }
      }
    }
  }
}

type GeneralSettings = {
  currency: string,
  defaultViewMode: string
}

type TransactionCategorySettings = {
  earnings: EarningCategory[],
  expenses: ExpenseCategory[]
}

export type EarningCategory = {
  name: string,
  isDefault: boolean
}

export type ExpenseCategory = EarningCategory & {
  subCategories: string[]
}

type DenominationSettings = {
  denominations: Denomination[]
}

type Denomination = {
  value: number,
  isDefault: boolean
}