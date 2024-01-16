import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Injectable, InternalServerErrorException, NotFoundException, NotImplementedException } from "@nestjs/common";
import { Settings } from "./entities/settings.entity";

@Injectable()
export class SettingsRepository {
  private readonly tableName: string = "bookkeeperSettings";
  constructor(private readonly client: DynamoDBClient) { }

  async createUserSettings(id: string): Promise<void> {
    await this.putUserSettings(id, Settings.default);
  }

  async getUserSettings(id: string): Promise<Settings> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: { id: { S: id } }
    });

    try {
      const response = await this.client.send(command);
      if (!response.Item) {
        console.log('User Settings not found');
        await this.createUserSettings(id);
        return await this.getUserSettings(id);
      }
      const settings = Settings.fromAttributeValues(response.Item);
      return settings;
    } catch (error) {
      console.log('Error in SettingsRepository.getUserSettings', id, error);
      throw new InternalServerErrorException();
    }
  }

  async putUserSettings(id: string, settings: Settings): Promise<void> {
    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: { id: { S: id }, settings: settings.toAttributeValue() }
    });

    try {
      await this.client.send(command);
    } catch (error) {
      console.log('Error in SettingsRepository.putUserSettings', id, JSON.stringify(settings), error);
      throw new InternalServerErrorException();
    }
  }
}