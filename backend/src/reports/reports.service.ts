import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetByDatesRequestDto } from './dto/get-by-dates-request.dto';
import { ReportsRepository } from './reports.repository';
import { Earning, Expense, Report } from './entities/report.entity';
import { ReportDto } from './dto/report.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ReportsService {

  constructor(private readonly reportsRepository: ReportsRepository) { }

  async getByDates(dto: GetByDatesRequestDto): Promise<ReportDto[]> {
    const reports = await this.reportsRepository.getByDates(dto.dates);
    dto.dates.forEach(date => {
      if (!reports.some(r => r.id === date)) {
        reports.push(Report.emptyWithDate(date));
      }
    });
    return reports.map(r => r.toDto());
  }

  async createOrUpdate(dto: ReportDto): Promise<ReportDto> {
    const report = await this.reportsRepository.put(Report.fromDto(dto));
    return report.toDto();
  }

  async processCsv(file: Express.Multer.File) {
    const lines = file.buffer.toString().split(/\r?\n/);
    const reports: Record<string, Report> = {};

    lines.forEach(line => {
      try {
        addCsvLineToReports(line, reports);
      } catch (error) {
        console.log('Error trying to parse csv line: ', line, error);
        throw new InternalServerErrorException();
      }
    });

    await this.reportsRepository.putMany(Object.values(reports));
  }
}

function addCsvLineToReports(line: string, reports: Record<string, Report>) {
  if (line === '') return;
  const parameters = line.split(',');

  const date = parseDate(parameters[0]);
  if (!(date in reports)) {
    const report = Report.emptyWithDate(date);
    reports[date] = report;
  }
  const categoryName = parameters[1];
  const amount = Math.abs(parseInt(parameters[2]));

  if (parameters.length === 3) {
    const earning: Earning = new Earning();
    earning.id = randomUUID();
    earning.reportDate = date;
    earning.category = categoryName;
    earning.amount = amount;
    reports[date].earnings.push(earning);
  } else {
    const note = parameters[3];
    const isIncludeInCash = parameters[4].toLowerCase() === 'true';
    const subCategory = categoryName === 'stock' ? note.toLowerCase() : '';
    const expense: Expense = new Expense();
    expense.id = randomUUID();
    expense.reportDate = date;
    expense.category = categoryName;
    expense.amount = amount;
    expense.isIncludeInCash = isIncludeInCash;
    expense.subCategory = subCategory;
    expense.note = note;
    reports[date].expenses.push(expense);
  }
}

function parseDate(s: string): string {
  const [ month, day, year ] = s.split('/');
  return year.concat(month.padStart(2, '0')).concat(day.padStart(2, '0'));
}