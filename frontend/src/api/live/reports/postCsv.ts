import config from "../../../config";
import { Report, ReportDto } from "../../../types/report/report";
import { Result } from "../../../types/result/result";
import helpers from "../../helpers";

export default async function postCsv(token: string | undefined, file: File): Promise<Result> {
  if (token == null) return Result.Fail().WithMessage('session token not found');
  const url = config.api.reports.url + '/upload-csv';
  const { signal, timeout } = helpers.getAbortSignal();
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
      signal: signal
    });
    if (!response.ok) return Result.Fail().WithMessage('server refused request');
    return Result.Succeed();
  } catch {
    return Result.Fail().WithMessage('unable to connect to server');
  } finally {
    clearTimeout(timeout);
  }
}