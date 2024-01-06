import * as React from 'react';
import './ExpenseInput.css'
import { Expense } from '../../../../../types/report/report';
import StandardFormLabeledInput from '../../../../forms/standardFormLabeledInput/StandardFormLabeledInput';
import { SettingsContext } from '../../../../../app/contexts/settings/SettingsContext';
import { ExpenseCategory } from '../../../../../types/settings/userSettings';
import { useCurrency } from '../../../../../hooks/useCurrency/useCurrency';

interface IExpenseInputProps {
  expense: Expense,
  update: (expense: Expense) => void
}

/**
*
* @returns {JSX.Element | null}
*/
export default function ExpenseInput(props: IExpenseInputProps): JSX.Element | null {

  const { settings } = React.useContext(SettingsContext);
  const subcategories = getDefaultSubcategories(settings?.categories.expenseCategories, props.expense);

  const { toString, toInt } = useCurrency();

  const [ amount, setAmount ] = React.useState<string>(toString(props.expense.amount));

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const amount = toInt(value);
    if (amount == null) return;
    setAmount(toString(amount, value.endsWith('.')));
    const newExpense: Expense = { ...props.expense, amount: amount };
    props.update(newExpense);
  }

  const handleChangeSubcategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    if (value === 'default') return;
    if (value === 'none') {
      // set subcategory to undefined
      props.expense.subCategory = undefined;
      const newExpense: Expense = { ...props.expense, subCategory: undefined };
      props.update(newExpense);
      return;
    }
    if (value === 'new') {
      // prompt for new, decline if exists, create and set otherwise, update settings!
      return;
    }
    const subcategory = value.substring(1);
    const newExpense: Expense = { ...props.expense, subCategory: subcategory };
    props.update(newExpense);
  }

  const useCalculator = () => {

  }

  return (
    <div className='expense-input-wrapper transaction-input-wrapper'>
      <div className="standard-form-row start">
        <h3>{props.expense.category}</h3>
        <select onChange={handleChangeSubcategory} value={`$${props.expense.subCategory}` ?? 'default'}>
          <option value='default'>subcategory</option>
          <option value='none'>none</option>
          {subcategories.map(
            subcategory =>
            <option key={`expense-input-subcategory-key-${props.expense.category}-${subcategory}`} value={`$${subcategory}`}>{subcategory}</option>
          )
          }
          <option value='new'>create new</option>
        </select>
      </div>
      <div className='standard-form-row'>
        <StandardFormLabeledInput label={'amount'} name={'amount'} value={amount} handleChange={handleChangeAmount} />
        <button className='standard-button' type='button' onClick={useCalculator}>calc</button>
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