import { Result } from "../../../types/result/result";
import { ChangePasswordRequest } from "../../../types/settings/changePassword";

export default async function changePassword(token: string | undefined, request: ChangePasswordRequest): Promise<Result> {
  await new Promise((res, rej) => {
    setTimeout(() => {
      res('');
    }, 500);
  });
  
  return Result.Fail().WithMessage('Local user does not require a password!');
}