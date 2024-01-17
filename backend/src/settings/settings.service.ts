import { Injectable } from '@nestjs/common';
import { SettingsRepository } from './settings.repository';
import { EarningCategory, ExpenseCategory, Settings, TransactionCategorySettings } from './entities/settings.entity';
import { Earning, Expense, Report } from 'src/reports/entities/report.entity';
import { EarningDto, ExpenseDto } from 'src/reports/dto/report.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) { }

  async getUserSettings(id: string): Promise<Settings> {
    return await this.settingsRepository.getUserSettings(id);
  }

  async updateSettings(id: string, settings: Settings): Promise<void> {
    settings.categories.earnings = settings.categories.earnings.map(e => ({ ...e, name: e.name.toLowerCase().trim()}))
    settings.categories.expenses = settings.categories.expenses.map(e => ({ ...e, name: e.name.toLowerCase().trim()}))
    settings.categories = removeDuplicateTransactionCategories(settings.categories)
    return await this.settingsRepository.putUserSettings(id, settings);
  }

  async addNewTransactionCategories(id: string, transactions: { earnings: EarningDto[], expenses: ExpenseDto[] }): Promise<void> {
    const currentSettings = await this.settingsRepository.getUserSettings(id);
    const categories = currentSettings.categories;

    const earnings: { name: string }[] = transactions.earnings.map(e => ({ name: e.category.toLowerCase().trim() }));
    const expenses: { name: string, subCategory: string | undefined }[] = transactions.expenses.map(e => ({ name: e.category.toLowerCase().trim(), subCategory: e.subCategory?.toLowerCase().trim() }));

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

    await this.settingsRepository.putUserSettings(id, currentSettings);
  }
}

function removeDuplicateTransactionCategories(categories: TransactionCategorySettings): TransactionCategorySettings {
  const earnings: EarningCategory[] = [];
  const expenses: ExpenseCategory[] = [];

  categories.earnings.forEach(earning => {
    if (!earnings.some(e => e.name === earning.name)) {
      earnings.push(earning);
    }
  });
  
  categories.expenses.forEach(expense => {
    if (!expenses.some(e => e.name === expense.name)) {
      expenses.push(expense);
    }
  });

  return { earnings, expenses };
}
