import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { ReportsRepository } from './reports.repository';
import { ReportsConfig } from './reports.config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ConfigService } from '@nestjs/config';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository, ReportsConfig, {
    provide: DynamoDBClient,
    inject: [ ConfigService ],
    useFactory: (configService: ConfigService) => {
      const config = new ReportsConfig(configService);
      return new DynamoDBClient({ region: config.region, endpoint: config.endpoint })
    }
  }],
  imports: [ SettingsModule ]
})
export class ReportsModule {}
