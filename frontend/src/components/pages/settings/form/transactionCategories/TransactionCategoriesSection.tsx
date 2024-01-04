import * as React from 'react';
import './TransactionCategoriesSection.css'
import { TransactionCategorySettings } from '../../../../../types/settings/userSettings';
import StandardFormLabeledCheckbox from '../../../../forms/standardFormLabeledCheckbox/StandardFormLabeledCheckbox';

interface ITransactionCategoriesSectionProps {
  transactionCategorySettings: TransactionCategorySettings | undefined,
  updateTransactionCategorySettings: (settings: TransactionCategorySettings) => void
}

/**
*
* @returns {JSX.Element | null}
*/
export default function TransactionCategoriesSection(props: ITransactionCategoriesSectionProps): JSX.Element | null {
  const settings = props.transactionCategorySettings;
  if (settings == null) return null;

  const handleToggle = (polarity: 'earning' | 'expense', name: string) => {
    const categories = polarity === 'earning' ? settings.earningCategories : settings.expenseCategories;
    const category = categories.find(c => c.name === name);
    if (category == null) return;
    category.isDefault = !category.isDefault;
    props.updateTransactionCategorySettings(settings);
  }


  return (
    <section className='transaction-categories-section settings-section'>
      <h2>transaction categories</h2>
      <h3>earnings</h3>
      <div className='transaction-category-settings-row heavy' >
        <span>Category</span><span>Default</span>
      </div>
      { settings.earningCategories.map(
        category =>
          <StandardFormLabeledCheckbox key={`earning-category-key-${category.name}`} label={category.name} name={`earning-category-${category.name}`} checked={settings.earningCategories.find(e => e.name === category.name)?.isDefault ?? false} handleToggle={() => handleToggle('earning', category.name)} />
      ) }
    </section>
  );
}