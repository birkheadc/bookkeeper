import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetRangeDto } from './dto/get-range.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('range')
  @UseGuards(JwtGuard)
  async getRange(@Body() dto: GetRangeDto) {
    return await this.transactionsService.getRange(dto);
  }
}
