import { BatchGetItemCommand, DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { Injectable } from "@nestjs/common";
import { Transaction } from "./entities/transaction.entity";
import { Range } from "../types/range/range";

@Injectable()
export class TransactionRepository {
  private readonly tableName: string = 'bookkeeperTransactions';
  constructor(private readonly client: DynamoDBClient) { }

  async getAllInDateRange(range: Range<number>): Promise<Transaction[]> {
    return [];
  }
}