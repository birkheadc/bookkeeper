import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectableConfig } from "src/config/injectableConfig";

@Injectable()
export class ReportsConfig extends InjectableConfig {
  region: string | undefined;
  endpoint: string | undefined;
  constructor(configService: ConfigService) {
    super(configService, 'reports');
  }
}