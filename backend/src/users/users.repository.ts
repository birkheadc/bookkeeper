import { DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import {HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersRepository {
  private readonly tableName: string = 'bookkeeperUsers';
  constructor(private readonly client: DynamoDBClient) { }

  async getUserById(id: string): Promise<User> {
    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: { id: { S: id } }
    });

    try {
      const response = await this.client.send(command);
      if (!response.Item) {
        console.log('no item in response:', response);
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const user = User.fromDynamoDBObject(response.Item);
      return user;
    } catch (error) {
      console.log('Error in getUserById', error);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async getUserByUsername(username: string): Promise<User> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'username',
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': { S: username }
      }
    });

    try {
      const response = await this.client.send(command);
      if (!response.Items) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

      const user = User.fromDynamoDBObject(response.Items[0]);
      return user;
    } catch (error) {
      console.log('Error in getUserById', error);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async putUser(user: User): Promise<User> {
    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: User.toItemObject(user),
      ReturnValues: 'ALL_OLD'
    });
    try {
      const response = await this.client.send(command);
      if (response.Attributes == null) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      return user;
    } catch (error) {
      console.log('Error in putUser', error);
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }    
  }
}