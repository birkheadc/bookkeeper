import { Injectable } from '@nestjs/common';
import { SettingsRepository } from './settings.repository';
import { Settings } from './entities/settings.entity';
import { Report } from 'src/reports/entities/report.entity';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) { }

  async getUserSettings(id: string): Promise<Settings> {
    return await this.settingsRepository.getUserSettings(id);
  }

  async updateSettings(id: string, settings: Settings): Promise<void> {
    return await this.settingsRepository.putUserSettings(id, settings);
  }

  async addNewTransactionCategories(id: string, reports: Report[]): Promise<void> {
    const currentSettings = await this.settingsRepository.getUserSettings(id);
    const categories = currentSettings.categories;

    reports.forEach(report => {
      const earnings: { name: string }[] = report.earnings.map(e => ({ name: e.category }));
      const expenses: { name: string, subCategory: string | undefined }[] = report.expenses.map(e => ({ name: e.category, subCategory: e.subCategory }));

      earnings.forEach(earning => {
        if (!categories.earnings.some(e => e.name === earning.name)) {
          categories.earnings.push({ name: earning.name, isDefault: false });
        }
      });

      expenses.forEach(expense => {
        const index = categories.expenses.findIndex(e => e.name === expense.name);
        if (index === -1) {
          categories.expenses.push({ name: expense.name, isDefault: false, subCategories: expense.subCategory ? [ expense.subCategory ] : [] });
          return;
        }
        if (expense.subCategory == null) return;
        if (!categories.expenses[index].subCategories.includes(expense.subCategory)) {
          categories.expenses[index].subCategories.push(expense.subCategory);
        }
      })
    });

    await this.settingsRepository.putUserSettings(id, currentSettings);
  }
}
