import { Injectable } from '@nestjs/common';
import { SettingsRepository } from './settings.repository';
import { Settings } from './entities/settings.entity';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) { }

  async getUserSettings(id: string): Promise<Settings> {
    return await this.settingsRepository.getUserSettings(id);
  }

  async updateSettings(id: string, settings: Settings): Promise<void> {
    return await this.settingsRepository.putUserSettings(id, settings);
  }
}
