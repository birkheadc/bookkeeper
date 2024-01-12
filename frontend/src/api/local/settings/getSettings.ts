import { BrowseViewMode } from "../../../types/browse/browseViewMode";
import { Result } from "../../../types/result/result";
import { Currency } from "../../../types/settings/currency";
import { UserSettings } from "../../../types/settings/userSettings";

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
    defaultViewMode: BrowseViewMode.MONTH,
    currency: Currency.KRW
  },
  categories: {
    earningCategories: [],
    expenseCategories: []
  },
  denominations: {
    denominations: []
  }
}