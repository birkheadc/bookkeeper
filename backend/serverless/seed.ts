import { randomUUID } from 'crypto';
import seedData from './data';
import { DynamoDBClient, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { hashSync } from 'bcrypt';

(async function seed() {
  const region = process.argv[2];
  const client = new DynamoDBClient({ region: region });

  {
    const command = new ScanCommand({
      TableName: 'bookkeeperUsers'
    });

    const response = await client.send(command);
    if (response.Count && response.Count > 0) return;

    seedData.usersData.forEach(async (element) => {
      element.id.S = randomUUID();
      element.password.S = hashSync(element.password.S, 10);
      const command = new PutItemCommand({
        TableName: 'bookkeeperUsers',
        Item: element
      });
      await client.send(command);
    });
  }

  {
    const command = new ScanCommand({
      TableName: 'bookkeeperTransactions'
    });

    const response = await client.send(command);
    if (response.Count && response.Count > 0) return;

    seedData.transactionsData.forEach(async (element) => {
      // element.id.S = randomUUID();
      // const command = new PutItemCommand({
      //   TableName: 'bookkeeperUsers',
      //   Item: element
      // });
      // await client.send(command);
    });
  }
})();