import { BrowseViewMode } from "../../types/browse/browseViewMode";
import { Result } from "../../types/result/result";
import { Currency } from "../../types/settings/currency";
import { Denomination, EarningCategory, ExpenseCategory, UserSettings } from "../../types/settings/userSettings";

export default async function getSettings(token: string | undefined): Promise<Result<UserSettings>> {
  if (token == null) return Result.Fail().WithMessage('Token invalid.');

  await new Promise((res, rej) => {
    setTimeout(() => {
      res('');
    }, 500);
  });

  return Result.Succeed().WithBody(DUMMY_SETTINGS);
}

const DUMMY_SETTINGS: UserSettings = {
  general: {
    defaultViewMode: BrowseViewMode.MONTH,
    currency: Currency.KRW
  },
  categories: {
    earningCategories: generateEarningCategories(),
    expenseCategories: generateExpenseCategories()
  },
  denominations: {
    denominations: generateDenominations()
  }
}

function generateEarningCategories(): EarningCategory[] {
  return [
    {
      name: 'cash',
      isDefault: true
    },{
      name: 'card',
      isDefault: true
    },{
      name: 'coupon',
      isDefault: false
    }
  ];
}

function generateExpenseCategories(): ExpenseCategory[] {
  return [
    {
      name: 'delivery',
      isDefault: true
    },
    {
      name: 'lunch',
      isDefault: false
    },
    {
      name: 'stock',
      isDefault: true,
      subcategories: [
        'food inc',
        'amazon'
      ]
    }
  ];
}

function generateDenominations(): Denomination[] {
  return [
    {
      value: 10_000,
      isDefault: true
    },{
      value: 50_000,
      isDefault: true
    },{
      value: 5_000,
      isDefault: false
    },
  ];
}