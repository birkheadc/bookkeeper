import { Body, Controller, Post, UseGuards, Put, UseInterceptors, UploadedFile, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetByDatesRequestDto } from './dto/get-by-dates-request.dto';
import { ReportDto } from './dto/report.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BearerAuthenticatedRequest } from 'src/auth/request/bearerAuthenticatedRequest';

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
  async putReport(@Request() request: BearerAuthenticatedRequest, @Body() dto: ReportDto): Promise<ReportDto> {
    return await this.reportsService.createOrUpdate(request.user.id, dto);
  }

  @Post('upload-csv')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(@Request() request: BearerAuthenticatedRequest, @UploadedFile() file: Express.Multer.File) {
    await this.reportsService.processCsv(request.user.id, file);
  }
}