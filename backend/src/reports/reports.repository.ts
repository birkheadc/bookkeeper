import { AttributeValue, BatchGetItemCommand, BatchWriteItemCommand, DynamoDBClient, KeysAndAttributes, PutItemCommand, WriteRequest } from "@aws-sdk/client-dynamodb";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Report } from "./entities/report.entity";

@Injectable()
export class ReportsRepository {
  private readonly tableName: string = 'bookkeeperReports';
  constructor(private readonly client: DynamoDBClient) { }

  async getByDates(dates: string[]): Promise<Report[]> {
    let reports: Report[] = [];
    let _dates = [...dates];
    while (_dates.length > 25) {
      const batch = await this.getByDates(_dates.splice(0, 25));
      reports = reports.concat(batch);
    }
    const requestItems: Record<string, KeysAndAttributes> = {};
    requestItems[this.tableName] = { Keys: [] };
    _dates.forEach(date => {
      requestItems[this.tableName].Keys?.push({ 'id': { S: date }});
    });

    const command = new BatchGetItemCommand({
      RequestItems: requestItems
    });

    try {
      const response = await this.client.send(command);
      const items = response.Responses;
      if (items == null) return [];

      reports = reports.concat(items[this.tableName].map(v => Report.fromAttributeValues(v)))
      return reports;
    } catch (error) {
      console.log('Error in ReportsRepository.getByDates', _dates, error);
      throw new InternalServerErrorException();
    }
  }

  async put(report: Report): Promise<Report> {
    const item = report.toAttributeValues();
    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: item
    });

    try {
      await this.client.send(command);
      return report;
    } catch (error) {
      console.log('Error in ReportsRepository.put', report, error);
      throw new InternalServerErrorException();
    }
  }

  async putMany(reports: Report[]) {
    while (reports.length > 25) {
      const batch = reports.splice(0, 25);
      await this.putMany(batch);
    }
    const requestItems: Record<string, WriteRequest[]> = {};
    requestItems[this.tableName] = [];
    reports.forEach(report => {
      const request: WriteRequest = {
        "PutRequest": {
          "Item": report.toAttributeValues()
        }
      }
      requestItems[this.tableName].push(request);
    });
    const command = new BatchWriteItemCommand({
      RequestItems: requestItems
    })

    try {
      await this.client.send(command);
    } catch (error) {
      console.log('Error in ReportsRepository.putMany', reports, error);
      throw new InternalServerErrorException();
    }
  }
}