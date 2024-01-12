import { Injectable } from '@nestjs/common';
import { GetByDatesDto } from './dto/get-by-dates.dto';
import { ReportsRepository } from './reports.repository';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {

  constructor(private readonly reportsRepository: ReportsRepository) { }

  async getByDates(dto: GetByDatesDto): Promise<Report[]> {
    const reports = await this.reportsRepository.getByDates(dto.dates);
    dto.dates.forEach(date => {
      if (!reports.some(r => r.id === date)) {
        reports.push(Report.emptyWithDate(date));
      }
    });
    return reports;
  }
}
