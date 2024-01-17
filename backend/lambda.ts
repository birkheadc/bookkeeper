import { configure as serverlessExpress } from '@codegenie/serverless-express';
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./src/app.module";
import { urlencoded, json } from 'express';

let cachedServer: any;

export const handler = async (event: any, context: any) => {
  if (!cachedServer) {
    const nestApp = await NestFactory.create(AppModule);
    nestApp.enableCors();
    nestApp.use(json({ limit: '50mb' }));
    nestApp.use(urlencoded({ extended: true, limit: '50mb' }));
    await nestApp.init();
    cachedServer = serverlessExpress({ app: nestApp.getHttpAdapter().getInstance() });
  }
  return cachedServer(event, context);
}