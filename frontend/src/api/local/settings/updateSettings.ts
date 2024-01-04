import { Result } from "../../../types/result/result";
import { UserSettings } from "../../../types/settings/userSettings";

export default async function updateSettings(token: any, userSettings: UserSettings): Promise<Result> {
  await new Promise((res, rej) => {
    setTimeout(() => {
      res('');
    }, 500);
  });

  try {
    const json = JSON.stringify(userSettings);
    window.localStorage.setItem('LOCAL_SETTINGS', json);
    return Result.Succeed().WithMessage('Settings saved.');
  } catch (error) {
    return Result.Fail().WithMessage(`Error when attempting to store settings locally: ${error}`);
  }
}