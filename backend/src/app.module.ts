import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { SecretsModule } from './secrets/secrets.module';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';
import configuration from './config/configuration';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [ConfigModule.forRoot({
    load: [ configuration ],
    envFilePath: ENV ? `./env/.env.${ENV}` : './env/.env',
    isGlobal: true
  }), AuthModule, UsersModule, SecretsModule, ReportsModule, SettingsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}