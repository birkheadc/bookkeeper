import { ExtendedDate } from "../../../types/date/extendedDate";
import { Earning, Expense, Report, ReportDto } from "../../../types/report/report";
import { Result } from "../../../types/result/result";
import { v4 as uuidv4 } from 'uuid';

export default async function postCsv(token: any, file: File): Promise<Result<Report[]>> {
  await new Promise((res, rej) => {
    setTimeout(() => {
      res('');
    }, 500);
  });

  const record: Record<string, Report> = {};

  const text = await file.text();
  const lines = text.split('\r\n');

  let wasError = false;
  
  lines.forEach(line => {
    if (line === '') return;
    try {
      const parameters = line.split(',');

      const date = parseDate(parameters[0]);
      const key = date.toDto();
      if (!(key in record)) {
        const report = new Report();
        report.id = date;
        record[key] = report;
      }

      const categoryName = parameters[1];
      const amount = Math.abs(parseInt(parameters[2]));

      if (parameters.length === 3) {
        const earning: Earning = new Earning();
        earning.id = uuidv4();
        earning.reportDate = date;
        earning.category = categoryName.toLowerCase().trim();
        earning.amount = amount;
        record[key].earnings.push(earning);
      } else {
        const note = parameters[3];
        const isIncludeInCash = parameters[4].toLowerCase() === 'true';
        const subCategory = categoryName === 'stock' ? note.toLowerCase().trim() : '';
        const expense: Expense = new Expense();
        expense.id = uuidv4();
        expense.reportDate = date;
        expense.category = categoryName.toLowerCase().trim();
        expense.amount = amount;
        expense.isIncludeInCash = isIncludeInCash;
        expense.subCategory = subCategory.toLowerCase().trim();
        expense.note = note;
        record[key].expenses.push(expense);
      }
    } catch (error) {
      wasError = true;
    }
  });
  if (wasError) {
    return Result.Fail().WithMessage('error processing file.');
  }
  
  const reports = Report.fromRecord(record);
  const dtos: ReportDto[] = [];
  reports.forEach(report => {
    dtos.push(report.toDto());
  });

  try {
    window.localStorage.removeItem('LOCAL_REPORTS');
    const json = JSON.stringify(dtos);
    window.localStorage.setItem('LOCAL_REPORTS', json);
    return Result.Succeed().WithBody(reports).WithMessage('uploaded data successfully');
  } catch {
    return Result.Fail().WithMessage('Something went wrong attempting to save to local storage.');
  }  
}

function parseDate(s: string): ExtendedDate {
  const [ month, day, year ] = s.split('/');
  const date = new ExtendedDate();
  date.setMonth(parseInt(month) - 1);
  date.setDate(parseInt(day));
  date.setFullYear(parseInt(year));
  return date;
}