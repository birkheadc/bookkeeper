import { Earning, Expense, Report, ReportDto } from "../../../types/report/report";
import { Result } from "../../../types/result/result";

export default async function postBatchTransactions(token: string | undefined, transactions: { earnings: Earning[], expenses: Expense[] }): Promise<Result> {
  await new Promise((res, rej) => {
    setTimeout(() => {
      res('');
    }, 500);
  });

  try {
    const reportsString = window.localStorage.getItem('LOCAL_REPORTS');
    const allReportDtos: ReportDto[] = reportsString ? JSON.parse(reportsString) : [];
    
    transactions.earnings.forEach(earning => {
      let report = allReportDtos.find(r => r.id === earning.reportDate.toDto());
      if (report == null) {
        const newReport = new Report();
        newReport.id = earning.reportDate;
        const dto = newReport.toDto();
        allReportDtos.push(dto);
        report = dto;
      }
      report.earnings.push(earning.toDto());
    });

    transactions.expenses.forEach(expense => {
      let report = allReportDtos.find(r => r.id === expense.reportDate.toDto());
      if (report == null) {
        const newReport = new Report();
        newReport.id = expense.reportDate;
        const dto = newReport.toDto();
        allReportDtos.push(dto);
        report = dto;
      }
      report.expenses.push(expense.toDto());
    });

    const json = JSON.stringify(allReportDtos);
    window.localStorage.setItem('LOCAL_REPORTS', json);
    return Result.Succeed().WithMessage('Successfully updated local database.');
  } catch {
    return Result.Fail().WithMessage('Something went wrong attempting to save to local storage.');
  }
}