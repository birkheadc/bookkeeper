import { ExtendedDate } from "../../../types/date/extendedDate";
import { Report, ReportDto } from "../../../types/report/report";
import { Result } from "../../../types/result/result";

export default async function getReportsByDates(token: any, dates: ExtendedDate[]): Promise<Result<Report[]>> {
  await new Promise((res, rej) => {
    setTimeout(() => {
      res('');
    }, 500);
  });

  const reportsString = window.localStorage.getItem('LOCAL_REPORTS');
  try {
    const allReportDtos: ReportDto[] = JSON.parse(reportsString ?? '[]');
    const reports: Report[] = [];
    dates.forEach(date => {
      const dto = allReportDtos.find(r => r.id === date.toDto());
      if (dto == null) {
        const blankReport = new Report();
        blankReport.id = date;
        reports.push(blankReport);
      } else {  
        reports.push(Report.fromDto(dto));
      }
    });
    return Result.Succeed().WithBody(reports);
  } catch (error) {
    return Result.Succeed().WithBody([]);
  }
}