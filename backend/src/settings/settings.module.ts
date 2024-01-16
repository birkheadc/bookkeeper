import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { SettingsRepository } from './settings.repository';
import { SettingsConfig } from './settings.config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, SettingsRepository, SettingsConfig, {
    provide: DynamoDBClient,
    inject: [ ConfigService ],
    useFactory: (configService: ConfigService) => {
      const config = new SettingsConfig(configService);
      return new DynamoDBClient({ region: config.region, endpoint: config.endpoint })
    }
  }],
  exports: [ SettingsService ]
})
export class SettingsModule {}
