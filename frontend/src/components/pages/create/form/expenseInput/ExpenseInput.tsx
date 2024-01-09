import * as React from 'react';
import './ExpenseInput.css'
import { Expense } from '../../../../../types/report/report';
import { SettingsContext } from '../../../../../app/contexts/settings/SettingsContext';
import { ExpenseCategory } from '../../../../../types/settings/userSettings';
import StandardFormLabeledCurrencyInput from '../../../../forms/standardFormLabeledCurrencyInput/StandardFormLabeledCurrencyInput';
import StandardFormLabeledCheckbox from '../../../../forms/standardFormLabeledCheckbox/StandardFormLabeledCheckbox';
import StandardFormLabeledInput from '../../../../forms/standardFormLabeledInput/StandardFormLabeledInput';
import { TrashIcon } from '@heroicons/react/24/outline';

interface IExpenseInputProps {
  expense: Expense,
  update: (expense: Expense) => void,
  delete: () => void
}

/**
*
* @returns {JSX.Element | null}
*/
export default function ExpenseInput(props: IExpenseInputProps): JSX.Element | null {

  const { settings, updateSettings } = React.useContext(SettingsContext);
  const subcategories = getDefaultSubcategories(settings?.categories.expenseCategories, props.expense);

  const handleDeleteExpense = () => {
    props.delete();
  }
  
  const handleChangeSubcategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    if (value === 'default') return;
    if (value === 'none') {
      props.expense.subCategory = undefined;
      const newExpense: Expense = { ...props.expense, subCategory: undefined };
      props.update(newExpense);
      return;
    }
    if (value === 'new') {
      if (settings == null) return;
      const newSubcategory = prompt('Enter name of new subcategory.');
      if (newSubcategory == null) return;
      if (subcategories.includes(newSubcategory)) {
        alert('That subcategory already exists!');
        return;
      }
      subcategories.push(newSubcategory);
      const newExpense: Expense = { ...props.expense, subCategory: newSubcategory };
      props.update(newExpense);
      return;
    }
    const subcategory = value.substring(1);
    const newExpense: Expense = { ...props.expense, subCategory: subcategory };
    props.update(newExpense);
  }

  const handleChangeAmount = (amount: number) => {
    const newExpense: Expense = { ...props.expense, amount: amount };
    props.update(newExpense);
  }

  const handleToggleIsCashInclude = () => {
    const newExpense: Expense = { ...props.expense, isIncludeInCash: !props.expense.isIncludeInCash };
    props.update(newExpense);
  }

  const handleChangeNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    const newExpense: Expense = { ...props.expense, note: value };
    props.update(newExpense);
  }

  return (
    <div className='expense-input-wrapper transaction-input-wrapper'>
      <div className="standard-form-row space-between">
        <h3>{props.expense.category}</h3>
        <select className='standard-input' onChange={handleChangeSubcategory} value={`$${props.expense.subCategory}` ?? 'none'}>
          {/* <option value='default'>subcategory</option> */}
          <option value='none'>no subcategory</option>
          {subcategories.map(
            subcategory =>
            <option key={`expense-input-subcategory-key-${props.expense.id}-${subcategory}`} value={`$${subcategory}`}>{subcategory}</option>
          )
          }
          <option value='new'>create new</option>
        </select>
        <button className='standard-button icon-button' onClick={handleDeleteExpense} type='button'><TrashIcon width={'20px'} /></button>
      </div>
      <StandardFormLabeledCurrencyInput amount={props.expense.amount} includeCalcButton update={handleChangeAmount} />
      <div className='standard-form-row'>
          <StandardFormLabeledCheckbox label={'include in cash?'} name={`expense-input-is-include-cash-${props.expense.id}`} checked={props.expense.isIncludeInCash} handleToggle={handleToggleIsCashInclude} />
      </div>
      <div className='standard-form-row'>
          <StandardFormLabeledInput label={'note'} name={`expense-input-note-${props.expense.id}`} value={props.expense.note ?? ''} handleChange={handleChangeNote} />
      </div>
    </div>
  );
}

function getDefaultSubcategories(expenseCategorySettings: ExpenseCategory[] | undefined, expense: Expense): string[] {
  let subcategories: string[] = [];

  if (expenseCategorySettings != null) {
    const category = expenseCategorySettings.find(c => c.name === expense.category);
    if (category != null && category.subcategories != null) {
      subcategories = category.subcategories;
    }
  }

  if (expense.subCategory != null && !subcategories.includes(expense.subCategory)) {
    subcategories.push(expense.subCategory);
  }

  return subcategories;
}