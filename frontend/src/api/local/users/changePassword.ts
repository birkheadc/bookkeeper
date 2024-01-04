import { Result } from "../../../types/result/result";
import { ChangePasswordRequest } from "../../../types/settings/changePassword";

export default async function changePassword(request: ChangePasswordRequest): Promise<Result> {
  return Result.Fail().WithMessage('Not yet implemented');
}