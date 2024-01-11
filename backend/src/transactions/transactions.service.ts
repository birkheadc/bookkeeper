import { Injectable } from '@nestjs/common';
import { GetRangeDto } from './dto/get-range.dto';
import { Transaction } from './entities/transaction.entity';
import { Range } from '../types/range/range';
import { TransactionRepository } from './transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepository: TransactionRepository) { }
  async getRange(dto: GetRangeDto): Promise<Transaction[]> {
    // Todo: Break the dates into ranges so we can call fewer (date between x and y) queries. Most of the time, the way the app is structured, this will just be a string of consecutive dates anyway.
    const ranges = getRangeDtoToArrayOfRanges(dto);
    let transactions: Transaction[] = [];
    ranges.forEach(async (range) => {
      transactions = transactions.concat(await this.transactionRepository.getAllInDateRange(range));
    });
    return transactions;
  }
}

function getRangeDtoToArrayOfRanges(dto: GetRangeDto): Range<number>[] {
  const ranges: Range<number>[] = [];

  let i = 0;
  const dates = dto.dates.sort();
  while (i < dates.length) {
    
    i++;
  }

  return ranges;
}