import { Injectable } from '@nestjs/common';
import { GetByDatesRequestDto } from './dto/get-by-dates-request.dto';
import { ReportsRepository } from './reports.repository';
import { Report } from './entities/report.entity';
import { ReportDto } from './dto/report.dto';

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
}
