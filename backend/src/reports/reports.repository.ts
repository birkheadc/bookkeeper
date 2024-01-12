import { BatchGetItemCommand, DynamoDBClient, KeysAndAttributes } from "@aws-sdk/client-dynamodb";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Report } from "./entities/report.entity";

@Injectable()
export class ReportsRepository {
  private readonly tableName: string = 'bookkeeperReports';
  constructor(private readonly client: DynamoDBClient) { }

  async getByDates(dates: string[]): Promise<Report[]> {
    
    const requestItems: Record<string, KeysAndAttributes> = {};
    requestItems[this.tableName] = { Keys: [] };
    dates.forEach(date => {
      requestItems[this.tableName].Keys?.push({ 'id': { S: date }});
    });

    const command = new BatchGetItemCommand({
      RequestItems: requestItems
    });

    try {
      const response = await this.client.send(command);
      const items = response.Responses;
      if (items == null) return [];

      const reports = items[this.tableName].map(v => Report.fromAttributeValues(v));      
      return reports;
    } catch (error) {
      console.log('Error in TransactionRepository.getAllInDateRange', dates, error);
      throw new InternalServerErrorException();
    }
  }
}