import { Body, Controller, Post, UseGuards, Put } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetByDatesRequestDto } from './dto/get-by-dates-request.dto';
import { ReportDto } from './dto/report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('get-by-dates')
  @UseGuards(JwtGuard)
  async getRange(@Body() dto: GetByDatesRequestDto): Promise<ReportDto[]> {
    return await this.reportsService.getByDates(dto);
  }

  @Put('put')
  @UseGuards(JwtGuard)
  async putReport(@Body() dto: ReportDto): Promise<ReportDto> {
    return await this.reportsService.createOrUpdate(dto);
  }
}