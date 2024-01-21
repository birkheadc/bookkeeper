import * as React from 'react';
import './BatchTransactionInput.css'
import { Earning, Expense } from '../../../../../types/report/report';
import StandardFormLabeledInput from '../../../../forms/standardFormLabeledInput/StandardFormLabeledInput';
import { ExtendedDate } from '../../../../../types/date/extendedDate';
import { SettingsContext } from '../../../../../app/contexts/settings/SettingsContext';
import { ExpenseCategory } from '../../../../../types/settings/userSettings';
import StandardFormLabeledCurrencyInput from '../../../../forms/standardFormLabeledCurrencyInput/StandardFormLabeledCurrencyInput';
import StandardFormLabeledCheckbox from '../../../../forms/standardFormLabeledCheckbox/StandardFormLabeledCheckbox';
import { TrashIcon } from '@heroicons/react/24/outline';

interface IBatchTransactionInputProps {
  type: 'earning' | 'expense',
  transaction: Earning | Expense,
  update: (transaction: Earning | Expense) => void,
  delete: () => void
}

/**
*
* @returns {JSX.Element | null}
*/
export default function BatchTransactionInput(props: IBatchTransactionInputProps): JSX.Element | null {

  const { settings } = React.useContext(SettingsContext);
  const subcategories = props.type === 'earning' ? [] : getDefaultSubcategories(settings?.categories.expenses, props.transaction as Expense);

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTransaction = props.transaction.copy();
    newTransaction.reportDate = new ExtendedDate(event.currentTarget.value);
    props.update(newTransaction);
  }

  const handleChangeSubcategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const expense = props.transaction as Expense;
    getDefaultSubcategories(settings?.categories.expenses, expense);
    const value = event.currentTarget.value;
    if (value === 'default') return;
    if (value === 'none') {
      expense.subCategory = undefined;
      const newExpense = expense.copy();
      newExpense.subCategory = undefined;
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
      const newExpense = expense.copy();
      newExpense.subCategory = newSubcategory;
      props.update(newExpense);
      return;
    }
    const subcategory = value.substring(1);
    const newExpense = expense.copy();
    newExpense.subCategory = subcategory;
    props.update(newExpense);
  }

  const handleChangeAmount = (amount: number) => {
    const newExpense = props.transaction.copy();
    newExpense.amount = amount;
    props.update(newExpense);
  }

  const handleToggleIsCashInclude = () => {
    const newExpense = props.transaction.copy() as Expense;
    newExpense.isIncludeInCash = !newExpense.isIncludeInCash;
    props.update(newExpense);
  }

  const handleChangeNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    const newExpense = props.transaction.copy() as Expense;
    newExpense.note = value;
    props.update(newExpense);
  }

  const handleDelete = () => {
    props.delete();
  }

  return (
    <div className='batch-transaction-input standard-form-row'>
      <h3 className={`batch-transaction-category-${props.type}`}>{props.transaction.category}</h3>
      {/* <StandardFormLabeledInput label={'category'} name={'category'} value={props.transaction.category} handleChange={handleChangeCategory} /> */}
      <input autoFocus className='standard-input' onChange={handleChangeDate} type='date' value={props.transaction.reportDate.toSimpleString()}></input>
      {props.type === 'expense' &&
        <select className='standard-input' onChange={handleChangeSubcategory} value={`$${(props.transaction as Expense).subCategory}` ?? 'none'}>
        {/* <option value='default'>subcategory</option> */}
        <option value='none'>no subcategory</option>
        {subcategories.map(
          subcategory =>
          <option key={`expense-input-subcategory-key-${(props.transaction as Expense).id}-${subcategory}`} value={`$${subcategory}`}>{subcategory}</option>
        )
        }
        <option value='new'>create new</option>
      </select>
      }
      <StandardFormLabeledCurrencyInput includeCalcButton amount={props.transaction.amount} update={handleChangeAmount} />
      {props.type === 'expense' &&
      <>
        <StandardFormLabeledCheckbox label={'include in cash?'} name={`expense-input-is-include-cash-${props.transaction.id}`} checked={(props.transaction as Expense).isIncludeInCash} handleToggle={handleToggleIsCashInclude} />
        <StandardFormLabeledInput label={'note'} name={`expense-input-note-${props.transaction.id}`} value={(props.transaction as Expense).note ?? ''} handleChange={handleChangeNote} />
      </>
      }
      <button className='standard-button icon-button' type='button' onClick={handleDelete}><TrashIcon width={'20px'} /></button>
    </div>
  );
}

function getDefaultSubcategories(expenseCategorySettings: ExpenseCategory[] | undefined, expense: Expense): string[] {
  let subcategories: string[] = [];

  if (expenseCategorySettings != null) {
    const category = expenseCategorySettings.find(c => c.name === expense.category);
    if (category != null && category.subCategories != null) {
      subcategories = category.subCategories;
    }
  }

  if (expense.subCategory != null && !subcategories.includes(expense.subCategory)) {
    subcategories.push(expense.subCategory);
  }

  return subcategories;
}

// amount
// *includeInCash
// *note
