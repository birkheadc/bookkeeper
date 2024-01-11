import config from "../../../config";
import { ExtendedDate } from "../../../types/date/extendedDate";
import { Report } from "../../../types/report/report";
import { GetRangeRequest } from "../../../types/requests/getRangeRequest";
import { Result } from "../../../types/result/result";
import helpers from "../../helpers";

export default async function getRangeReports(token: string | undefined, dates: ExtendedDate[]): Promise<Result<Report[]>> {
  if (token == null) return Result.Fail().WithMessage('Token invalid.');

  const url = config.api.transactions.url + `/range`;
  const { signal, timeout } = helpers.getAbortSignal();

  const request: GetRangeRequest = {
    dates: dates.map(d => d.toDatabaseDate())
  }

  console.log('send reqeust:', JSON.stringify(request));

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
    console.log(response.status);
  } catch (error) {
    console.log(error)
  } finally {
    clearTimeout(timeout);
  }
  return Result.Fail().WithMessage('not yet implemented');
}