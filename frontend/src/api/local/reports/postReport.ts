import { Report, ReportDto } from "../../../types/report/report";
import { Result } from "../../../types/result/result";

export default async function postReport(token: string | undefined, report: Report): Promise<Result> {
  await new Promise((res, rej) => {
    setTimeout(() => {
      res('');
    }, 500);
  });

  try {
    const reportsString = window.localStorage.getItem('LOCAL_REPORTS');
    const allReportDtos: ReportDto[] = reportsString ? JSON.parse(reportsString) : [];
    const index = allReportDtos.findIndex(r => r.id === report.id.toDto());
    if (index === -1) {
      allReportDtos.push(report.toDto());
    } else {
      allReportDtos[index] = report.toDto();
    }
    const json = JSON.stringify(allReportDtos);
    window.localStorage.setItem('LOCAL_REPORTS', json);
    return Result.Succeed().WithMessage('Successfully updated local database.');
  } catch {
    return Result.Fail().WithMessage('Something went wrong attempting to save to local storage.');
  }
}