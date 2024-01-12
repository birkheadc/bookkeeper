import config from "../../../config";
import { ExtendedDate } from "../../../types/date/extendedDate";
import { Report } from "../../../types/report/report";
import { GetByDatesRequest } from "../../../types/requests/getRangeRequest";
import { Result } from "../../../types/result/result";
import helpers from "../../helpers";

export default async function getReportsByDates(token: string | undefined, dates: ExtendedDate[]): Promise<Result<Report[]>> {
  if (token == null) return Result.Fail().WithMessage('Token invalid.');

  const url = config.api.reports.url + `/get-by-dates`;
  const { signal, timeout } = helpers.getAbortSignal();

  const request: GetByDatesRequest = {
    dates: dates.map(d => d.toDto())
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request),
      signal: signal
    });
    if (!response.ok) return Result.Fail().WithMessage('Server refused request.');
    const data = await response.json();
    const reports = Report.fromJson(data);

    return Result.Succeed().WithBody(reports);
  } catch (error) {
    console.log(error)
  } finally {
    clearTimeout(timeout);
  }
  return Result.Fail().WithMessage('not yet implemented');
}