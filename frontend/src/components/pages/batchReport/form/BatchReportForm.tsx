import * as React from 'react';
import './BatchReportForm.css'
import { PlusIcon } from '@heroicons/react/24/outline';
import { Earning, Expense } from '../../../../types/report/report';
import BatchTransactionInput from './batchTransactionInput/BatchTransactionInput';
import { v4 as uuidv4 } from 'uuid';
import { SettingsContext } from '../../../../app/contexts/settings/SettingsContext';
import { ExtendedDate } from '../../../../types/date/extendedDate';
import { Result } from '../../../../types/result/result';
import ResultDisplay from '../../../resultDisplay/ResultDisplay';
import { ReportsContext } from '../../../../app/contexts/reports/ReportsContext';

interface IBatchReportFormProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function BatchReportForm(props: IBatchReportFormProps): JSX.Element | null {

  const [ transactions, setTransactions ] = React.useState<{ earnings: Earning[], expenses: Expense[] }>({ earnings: [], expenses: [] });
  const { settings } = React.useContext(SettingsContext);
  const { addTransactions } = React.useContext(ReportsContext);
  const [ recentResult, setRecentResult ] = React.useState<Result | undefined>();

  const handleAddEarning = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;

    if (value === 'default') return;

    const category = (value === 'new') ? prompt('Enter name of new category') : value.substring(1);
    event.currentTarget.value = 'default';

    if (category == null) return;
    
    setTransactions(transactions => {
      const newEarnings = [...transactions.earnings];
      newEarnings.push(Earning.fromDto({ id: uuidv4(), reportDate: new ExtendedDate().toDto(), category: category, amount: 0 }))
      return { ...transactions, earnings: newEarnings};
    });
  }

  const handleAddExpense = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;

    if (value === 'default') return;

    const category = (value === 'new') ? prompt('Enter name of new category') : value.substring(1);
    event.currentTarget.value = 'default';

    if (category == null) return;

    setTransactions(transactions => {
      const newExpenses = [...transactions.expenses];
      newExpenses.push(Expense.fromDto({ id: uuidv4(), reportDate: new ExtendedDate().toDto(), category: category, amount: 0, isIncludeInCash: false }))
      return { ...transactions, expenses: newExpenses };
    });
  }



  const handleUpdate = (type: 'earning' | 'expense', transaction: Earning | Expense) => {
    // On second thought, `type: 'earning' | 'expense' was not such a good idea after all.
    setTransactions(transactions => {
      if (type === 'earning') {
        const earning = transaction as Earning;
        const index = transactions.earnings.findIndex(e => e.id === earning.id);
        if (index === -1) return transactions;
        const newEarnings = [...transactions.earnings];
        newEarnings[index] = earning;
        const newTransactions = {...transactions, earnings: newEarnings};
        return newTransactions;
      }
      const expense = transaction as Expense;
      const index = transactions.expenses.findIndex(e => e.id === expense.id);
      if (index === -1) return transactions;
      const newExpenses = [...transactions.expenses];
      newExpenses[index] = expense;
      const newTransactions = {...transactions, expenses: newExpenses};
      return newTransactions;
    })
  }

  const handleDelete = (type: 'earning' | 'expense', id: string) => {
    setTransactions(transactions => {
      if (type === 'earning') {
        const newEarnings = [ ...transactions.earnings ].filter(e => e.id !== id);
        const newTransactions = { ...transactions, earnings: newEarnings };
        return newTransactions;
      }
      const newExpenses = [ ...transactions.expenses ].filter(e => e.id !== id);
      const newTransactions = { ...transactions, expenses: newExpenses };
      return newTransactions;
    })
  }
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await addTransactions(transactions);
    setRecentResult(result);
  }

  return (
    <form className='batch-report-form-wrapper standard-form' onSubmit={handleSubmit}>
      <ResultDisplay result={recentResult} />
      {transactions.earnings.map(earning =>
        <BatchTransactionInput key={`batch-transaction-input-${earning.id}`} type='earning' transaction={earning} update={(t) => handleUpdate('earning', t)} delete={() => handleDelete('earning', earning.id)}/>
      )}
      {transactions.expenses.map(expense =>
        <BatchTransactionInput key={`batch-transaction-input-${expense.id}`} type='expense' transaction={expense} update={(t) => handleUpdate('expense', t)} delete={() => handleDelete('expense', expense.id)}/>
      )}
      <div className="standard-form-row">
      <select className='standard-input' onChange={handleAddEarning}>
            <option value='default'>add earning</option>
            {
              settings?.categories.earnings.map(
                category =>
                <option key={`add-earning-option-key-${category.name}`} value={`$${category.name}`}>{category.name}</option>
              )
            }
            <option value='new'>create new</option>
          </select>
          <select className='standard-input' onChange={handleAddExpense}>
            <option value='default'>add expense</option>
            {
              settings?.categories.expenses.map(
                category =>
                <option key={`add-expense-option-key-${category.name}`} value={`$${category.name}`}>{category.name}</option>
              )
            }
            <option value='new'>create new</option>
          </select>
      </div>
      <button className='standard-button' type='submit'>submit</button>
    </form>
  );
}