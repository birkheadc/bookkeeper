import { Result } from "../../../types/result/result";
import { UserSettings } from "../../../types/settings/userSettings";

export default async function updateSettings(token: any, userSettings: UserSettings): Promise<Result> {
  return Result.Fail().WithMessage('Not yet implemented');
}