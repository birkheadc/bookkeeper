import { ExtendedDate } from "../../../types/date/extendedDate";
import { Report, ReportDto } from "../../../types/report/report";
import { Result } from "../../../types/result/result";

export default async function getRangeReports(token: any, dates: ExtendedDate[]): Promise<Result<Report[]>> {
  await new Promise((res, rej) => {
    setTimeout(() => {
      res('');
    }, 500);
  });

  const reportsString = window.localStorage.getItem('LOCAL_REPORTS');
  console.log('got this from LOCAL_REPORTS:', reportsString);
  try {
    const allReportDtos: ReportDto[] = JSON.parse(reportsString ?? '[]');
    const reports: Report[] = [];
    dates.forEach(date => {
      const dto = allReportDtos.find(r => r.date === date.valueOf());
      if (dto == null) {
        const blankReport = new Report();
        blankReport.date = date;
        reports.push(blankReport);
      } else {  
        reports.push(Report.fromDto(dto));
      }
    });
    console.log(reports);
    return Result.Succeed().WithBody(reports);
  } catch (error) {
    console.log(error);
    return Result.Succeed().WithBody([]);
  }
}