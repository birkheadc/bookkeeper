import { Injectable } from '@nestjs/common';
import { GetRangeDto } from './dto/get-range.dto';
import { Transaction } from './entities/transaction.entity';
import { Range } from '../types/range/range';
import { TransactionRepository } from './transactions.repository';
import helpers from '../helpers';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepository: TransactionRepository) { }
  async getRange(dto: GetRangeDto): Promise<Transaction[]> {
    // Todo: Break the dates into ranges so we can call fewer (date between x and y) queries. Most of the time, the way the app is structured, this will just be a string of consecutive dates anyway.
    console.log('dto:', dto);
    const ranges = helpers.general.sortedArrayToArrayOfRange(dto.dates.sort());
    console.log('ranges:', ranges);
    let transactions: Transaction[] = [];
    ranges.forEach(async (range) => {
      transactions = transactions.concat(await this.transactionRepository.getAllInDateRange(range));
    });
    return transactions;
  }
}