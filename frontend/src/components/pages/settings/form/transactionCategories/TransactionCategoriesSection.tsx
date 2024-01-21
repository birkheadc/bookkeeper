import * as React from 'react';
import './TransactionCategoriesSection.css'
import { ExpenseCategory, TransactionCategorySettings } from '../../../../../types/settings/userSettings';
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
    const categories = polarity === 'earning' ? settings.earnings : settings.expenses;
    const category = categories.find(c => c.name === name);
    if (category == null) return;
    category.isDefault = !category.isDefault;
    props.updateTransactionCategorySettings(settings);
  }

  const handleAddNew = (polarity: 'earning' | 'expense') => {
    const name = prompt('Enter name of new category.');
    if (name == null) return;

    const categories = polarity === 'earning' ? settings.earnings : settings.expenses;
    const doesExist = categories.some(c => c.name.toLowerCase().trim() === name.toLowerCase().trim());

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
    const categories = polarity === 'earning' ? settings.earnings : settings.expenses;
    const newCategories = categories.filter(c => c.name !== name);
    const newSettings = (polarity === 'earning') ? { ...settings, earnings: newCategories } : { ...settings, expenses: newCategories };
    props.updateTransactionCategorySettings(newSettings);
  }

  const handleAddSubcategory = (category: ExpenseCategory) => {
    const subcategory = prompt(`Enter name of new subcategory for ${category.name}.`);
    if (subcategory == null) return;
    if (category.subCategories == null) {
      category.subCategories = [];
    }
    if (category.subCategories.includes(subcategory)) {
      alert('That subcategory already exists!');
      return;
    }
    category.subCategories.push(subcategory);
    props.updateTransactionCategorySettings(settings);
  }

  const handleRemoveSubcategory = (category: ExpenseCategory, subcategory: string) => {
    if (category.subCategories == null) return;
    category.subCategories = category.subCategories.filter(s => s !== subcategory);
    props.updateTransactionCategorySettings(settings);
  }

  return (
    <section className='transaction-categories-section settings-sub-section'>
      <h2>default transaction categories</h2>
      <div className='transaction-categories-section-subsection'>
        <h3>earnings</h3>
        
        { settings.earnings.map(
          category =>
            <div key={`earning-category-key-${category.name}`} className='standard-form-row'>
              <StandardFormLabeledCheckbox label={category.name} name={`earning-category-${category.name}`} checked={category.isDefault} handleToggle={() => handleToggle('earning', category.name)} />
              <button className='standard-button icon-button' type='button' onClick={() => handleDelete('earning', category.name)}><TrashIcon width={'1em'}/> delete</button>
            </div>
        ) }
        <button className='standard-button icon-button' type='button' onClick={() => handleAddNew('earning')}><PlusIcon width={'1em'} />new</button>
      </div>
      <div className='transaction-categories-section-subsection'>
        <h3>expenses</h3>
        
        { settings.expenses.map(
          category =>
            <div key={`expense-category-key-${category.name}`} className='settings-expense-category'>
              <div className="standard-form-row">
                <StandardFormLabeledCheckbox label={category.name} name={`expense-category-${category.name}`} checked={category.isDefault} handleToggle={() => handleToggle('expense', category.name)} />
                <button className='standard-button icon-button' type='button' onClick={() => handleDelete('expense', category.name)}><TrashIcon width={'1em'}/> delete</button>
              </div>
              <div className='settings-expense-category-subcategories'>
                { category.subCategories &&
                  <ul>
                    {category.subCategories.map(
                      subcategory =>
                      <li key={`settings-expense-subcategory-key-${subcategory}`} className='settings-expense-subcategory'>
                        <div>
                          <span>{subcategory}</span>
                          <button type='button' className='standard-button icon-button' onClick={() => handleRemoveSubcategory(category, subcategory)}><TrashIcon width={'1em'} />remove</button>
                        </div>
                      </li>
                    )}
                  </ul>
                }
                <button type='button' className='standard-button icon-button' onClick={() => handleAddSubcategory(category)}><PlusIcon width={'1em'} />add subcategory</button>
              </div>
            </div>
        ) }
        <button className='standard-button icon-button' type='button' onClick={() => handleAddNew('expense')}><PlusIcon width={'1em'} />new</button>
      </div>
      
    </section>
  );
}