import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetByDatesRequestDto } from './dto/get-by-dates-request.dto';
import { ReportsRepository } from './reports.repository';
import { Earning, Expense, Report } from './entities/report.entity';
import { ReportDto } from './dto/report.dto';
import { randomUUID } from 'crypto';
import { SettingsService } from 'src/settings/settings.service';
import { PutTransactionsRequestDto } from './dto/put-transactions-request.dto';

@Injectable()
export class ReportsService {

  constructor(private readonly reportsRepository: ReportsRepository, private readonly settingsService: SettingsService) { }

  async getByDates(dto: GetByDatesRequestDto): Promise<ReportDto[]> {
    const reports = await this.reportsRepository.getByDates(dto.dates);
    dto.dates.forEach(date => {
      if (!reports.some(r => r.id === date)) {
        reports.push(Report.emptyWithDate(date));
      }
    });
    return reports.map(r => r.toDto());
  }

  async createOrUpdate(id: string, dto: ReportDto): Promise<ReportDto> {
    const report = await this.reportsRepository.put(Report.fromDto(dto));
    await this.settingsService.addNewTransactionCategories(id, { earnings: report.earnings, expenses: report.expenses });
    return report.toDto();
  }

  // async processCsv(id: string, file: Express.Multer.File) {
  //   const lines = file.buffer.toString().split(/\r?\n/);
  //   const reports: Record<string, Report> = {}; 

  //   lines.forEach(line => {
  //     try {
  //       addCsvLineToReports(line, reports);
  //     } catch (error) {
  //       console.log('Error trying to parse csv line: ', line, error);
  //       throw new InternalServerErrorException();
  //     }
  //   });

  //   await this.reportsRepository.putMany(Object.values(reports));
  //   await this.settingsService.addNewTransactionCategories(id, Object.values(reports));
  // }

  async addTransactions(id: string, dto: PutTransactionsRequestDto): Promise<void> {
    const dates: string[] = [];
    dto.earnings.forEach(earning => {
      if (!dates.includes(earning.reportDate)) dates.push(earning.reportDate);
    });
    dto.expenses.forEach(expense => {
      if (!dates.includes(expense.reportDate)) dates.push(expense.reportDate);
    })
    const reports = await this.getByDates({dates});
    dto.earnings.forEach(earning => {
      const report = reports.find(r => r.id === earning.reportDate);
      if (report != null) report.earnings.push(earning);
    });
    dto.expenses.forEach(expense => {
      const report = reports.find(r => r.id === expense.reportDate);
      if (report != null) report.expenses.push(expense);
    });
    await this.reportsRepository.putMany(reports.map(dto => Report.fromDto(dto)));
    await this.settingsService.addNewTransactionCategories(id, { earnings: dto.earnings, expenses: dto.expenses });
  }
}

function addCsvLineToReports(line: string, reports: Record<string, Report>) {
  if (line === '') return;
  const parameters = line.split(',');

  const date = parseDate(parameters[0]);

  if (date === '20230523') {
    console.log(line);
  };

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
    earning.category = categoryName.toLowerCase().trim();
    earning.amount = amount;
    reports[date].earnings.push(earning);
  } else {
    const note = parameters[3].trim() === '' ? undefined : parameters[3].trim();
    const isIncludeInCash = parameters[4].toLowerCase() === 'true';
    const subCategory = categoryName === 'stock' ? note : undefined;
    const expense: Expense = new Expense();
    expense.id = randomUUID();
    expense.reportDate = date;
    expense.category = categoryName.toLowerCase().trim();
    expense.amount = amount;
    expense.isIncludeInCash = isIncludeInCash;
    expense.subCategory = subCategory?.toLowerCase().trim();
    expense.note = note;
    reports[date].expenses.push(expense);
  }
}

function parseDate(s: string): string {
  const [ month, day, year ] = s.split('/');
  return year.concat(month.padStart(2, '0')).concat(day.padStart(2, '0'));
}