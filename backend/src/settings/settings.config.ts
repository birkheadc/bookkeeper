import { Injectable } from "@nestjs/common";
import { InjectableConfig } from "../config/injectableConfig";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SettingsConfig extends InjectableConfig {
  region: string | undefined;
  endpoint: string | undefined;
  constructor(configService: ConfigService) {
    super(configService, 'settings');
  }
}