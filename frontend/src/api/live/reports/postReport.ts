import config from "../../../config";
import { Report, ReportDto } from "../../../types/report/report";
import { Result } from "../../../types/result/result";
import helpers from "../../helpers";

export default async function postReport(token: string | undefined, report: Report): Promise<Result> {
  if (token == null) return Result.Fail().WithMessage('session token not found');

  const url = config.api.reports.url + '/put';
  const { signal, timeout } = helpers.getAbortSignal();

  const request = report.toDto();

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request),
      signal: signal
    });
    if (!response.ok) return Result.Fail().WithMessage('request was denied by server');
    return Result.Succeed().WithMessage('success');
  } catch {
    return Result.Fail().WithMessage('unable to connect to server');
  } finally {
    clearTimeout(timeout);
  }
}