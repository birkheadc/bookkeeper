import * as React from 'react';
import './TransactionCategoriesSection.css'
import { TransactionCategorySettings } from '../../../../../types/settings/userSettings';
import StandardFormLabeledCheckbox from '../../../../forms/standardFormLabeledCheckbox/StandardFormLabeledCheckbox';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ITransactionCategoriesSectionProps {
  transactionCategorySettings: TransactionCategorySettings,
  updateTransactionCategorySettings: (settings: TransactionCategorySettings) => void
}

/**
*
* @returns {JSX.Element | null}
*/
export default function TransactionCategoriesSection(props: ITransactionCategoriesSectionProps): JSX.Element | null {
  const settings = props.transactionCategorySettings;
  
  const handleToggle = (polarity: 'earning' | 'expense', name: string) => {
    const categories = polarity === 'earning' ? settings.earningCategories : settings.expenseCategories;
    const category = categories.find(c => c.name === name);
    if (category == null) return;
    category.isDefault = !category.isDefault;
    props.updateTransactionCategorySettings(settings);
  }

  const handleAddNew = (polarity: 'earning' | 'expense') => {
    const name = prompt('Enter name of new category.');
    if (name == null) return;

    const categories = polarity === 'earning' ? settings.earningCategories : settings.expenseCategories;
    const doesExist = categories.some(c => c.name === name);

    if (doesExist) {
      alert('That category already exists!');
      return;
    }

    categories.push({
      name: name,
      isDefault: false
    });
    props.updateTransactionCategorySettings(settings);
  }

  const handleDelete = (polarity: 'earning' | 'expense', name: string) => {
    const categories = polarity === 'earning' ? settings.earningCategories : settings.expenseCategories;
    const newCategories = categories.filter(c => c.name !== name);
    const newSettings = polarity === 'earning' ? { ...settings, earningCategories: newCategories } : { ...settings, expenseCategories: newCategories };
    props.updateTransactionCategorySettings(newSettings);
  }


  return (
    <section className='transaction-categories-section settings-sub-section'>
      <h2>default transaction categories</h2>
      <h3>earnings</h3>
      
      { settings.earningCategories.map(
        category =>
          <div key={`earning-category-key-${category.name}`} className='standard-form-row'>
            <StandardFormLabeledCheckbox label={category.name} name={`earning-category-${category.name}`} checked={category.isDefault} handleToggle={() => handleToggle('earning', category.name)} />
            <button className='standard-button icon-button' type='button' onClick={() => handleDelete('earning', category.name)}><TrashIcon width={'20px'}/> delete</button>
          </div>
      ) }
      <button className='standard-button icon-button' type='button' onClick={() => handleAddNew('earning')}><PlusIcon width={'20px'} />new</button>
      <h3>expenses</h3>
      
      { settings.expenseCategories.map(
        category =>
          <div key={`expense-category-key-${category.name}`} className='standard-form-row'>
            <StandardFormLabeledCheckbox label={category.name} name={`expense-category-${category.name}`} checked={category.isDefault} handleToggle={() => handleToggle('expense', category.name)} />
            <button className='standard-button icon-button' type='button' onClick={() => handleDelete('expense', category.name)}><TrashIcon width={'20px'}/> delete</button>
          </div>
      ) }
      <button className='standard-button icon-button' type='button' onClick={() => handleAddNew('expense')}><PlusIcon width={'20px'} />new</button>
    </section>
  );
}