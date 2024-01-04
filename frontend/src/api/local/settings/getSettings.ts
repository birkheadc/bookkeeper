import { BrowseViewMode } from "../../../types/browse/browseViewMode";
import { Result } from "../../../types/result/result";
import { UserSettings, TransactionCategory, Denomination } from "../../../types/settings/userSettings";

export default async function getSettings(token: any): Promise<Result<UserSettings>> {
  await new Promise((res, rej) => {
    setTimeout(() => {
      res('');
    }, 500);
  });

  const settingsString = window.localStorage.getItem('LOCAL_SETTINGS');
  if (settingsString == null) return Result.Succeed().WithBody(DEFAULT_SETTINGS);
  try {
    const settings: UserSettings = JSON.parse(settingsString);
    return Result.Succeed().WithBody(settings);
  } catch {
    return Result.Succeed().WithBody(DEFAULT_SETTINGS);
  }
}

const DEFAULT_SETTINGS: UserSettings = {
  general: {
    defaultViewMode: BrowseViewMode.MONTH
  },
  categories: {
    earningCategories: generateEarningCategories(),
    expenseCategories: generateExpenseCategories()
  },
  denominations: {
    denominations: generateDenominations()
  }
}

function generateEarningCategories(): TransactionCategory[] {
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

function generateExpenseCategories(): TransactionCategory[] {
  return [
    {
      name: 'delivery',
      isDefault: true
    },
    {
      name: 'lunch',
      isDefault: false
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