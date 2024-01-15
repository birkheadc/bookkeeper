import config from "../../../config";
import { Result } from "../../../types/result/result";
import { UserSettings } from "../../../types/settings/userSettings";
import helpers from "../../helpers";

export default async function updateSettings(token: any, userSettings: UserSettings): Promise<Result> {
  if (token == null) return Result.Fail().WithMessage('Token invalid.');

  const url = config.api.settings.url;
  const { signal, timeout } = helpers.getAbortSignal();

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(UserSettings.toDto(userSettings)),
      signal: signal
    });
    if (!response.ok) return Result.Fail().WithMessage('server refused request');
    return Result.Succeed();
  } catch {
    return Result.Fail().WithMessage('error connecting to server')
  } finally {
    clearTimeout(timeout);
  }
}