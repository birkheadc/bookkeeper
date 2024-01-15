import config from "../../../config";
import { BrowseViewMode } from "../../../types/browse/browseViewMode";
import { Result } from "../../../types/result/result";
import { Currency } from "../../../types/settings/currency";
import { Denomination, EarningCategory, ExpenseCategory, UserSettings } from "../../../types/settings/userSettings";
import helpers from "../../helpers";

export default async function getSettings(token: string | undefined): Promise<Result<UserSettings>> {
  if (token == null) return Result.Fail().WithMessage('Token invalid.');

  const url = config.api.settings.url;
  const { signal, timeout } = helpers.getAbortSignal();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      signal: signal
    });
    if (!response.ok) return Result.Fail().WithMessage('server refused request');
    const data = await response.json();
    const settings = UserSettings.fromJson(data);
    return Result.Succeed().WithBody(settings);
  } catch {
    return Result.Fail().WithMessage('error connecting to server')
  } finally {
    clearTimeout(timeout);
  }
}