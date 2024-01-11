import { Report } from "../../../types/report/report";
import { Result } from "../../../types/result/result";

export default async function postCsv(token: string | undefined, file: File): Promise<Result<Report[]>> {
  return Result.Fail().WithMessage('Not yet implemented');
}