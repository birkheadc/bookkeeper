import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetByDatesDto } from './dto/get-by-dates.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('by-dates')
  @UseGuards(JwtGuard)
  async getRange(@Body() dto: GetByDatesDto) {
    return await this.reportsService.getByDates(dto);
  }
}