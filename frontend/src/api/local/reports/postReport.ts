import { Report, ReportDto } from "../../../types/report/report";
import { Result } from "../../../types/result/result";

export default async function postReport(token: any, report: Report): Promise<Result> {
  await new Promise((res, rej) => {
    setTimeout(() => {
      res('');
    }, 500);
  });

  try {
    const reportsString = window.localStorage.getItem('LOCAL_REPORTS');
    const allReportDtos: ReportDto[] = reportsString ? JSON.parse(reportsString) : [];
    const index = allReportDtos.findIndex(r => r.date === report.date.valueOf());
    if (index === -1) {
      allReportDtos.push(ReportDto.fromReport(report));
    } else {
      allReportDtos[index] = ReportDto.fromReport(report);
    }
    const json = JSON.stringify(allReportDtos);
    console.log('Write this to LOCAL_REPORTS:', json);
    window.localStorage.setItem('LOCAL_REPORTS', json);
    return Result.Succeed().WithMessage('Successfully updated local database.');
  } catch {
    return Result.Fail().WithMessage('Something went wrong attempting to save to local storage.');
  }
}