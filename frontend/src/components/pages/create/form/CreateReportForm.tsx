import * as React from 'react';
import './CreateReportForm.css'
import ReportDisplayCard from '../../../shared/reportDisplay/ReportDisplayCard';
import { Earning, Expense, Report } from '../../../../types/report/report';
import { SettingsContext } from '../../../../app/contexts/settings/SettingsContext';
import { ExtendedDate } from '../../../../types/date/extendedDate';
import { ReportsContext } from '../../../../app/contexts/reports/ReportsContext';
import { Result } from '../../../../types/result/result';
import ResultDisplay from '../../../resultDisplay/ResultDisplay';
import EarningInput from './earningInput/EarningInput';
import ExpenseInput from './expenseInput/ExpenseInput';

interface ICreateReportFormProps {
  date: ExtendedDate
}

/**
*
* @returns {JSX.Element | null}
*/
export default function CreateReportForm(props: ICreateReportFormProps): JSX.Element | null {
  const { getReport } = React.useContext(ReportsContext);
  const [ report, setReport ] = React.useState<Report | undefined>();
  const [ recentResult, setRecentResult ] = React.useState<Result | undefined>();

  const { settings } = React.useContext(SettingsContext);

  React.useEffect(() => {
    (async function fetchReportOnDateChange() {
      if (props.date == null) return;
      const result = await getReport(props.date);
      setRecentResult(result);
      if (result.wasSuccess && result.body != null) {
        setReport(result.body);
      }
    })();
  }, [ props.date ]);

  if (report == null) return null;

  const handleUpdateEarning = (earning: Earning) => {

  }

  const handleUpdateExpense = (expense: Expense) => {
    setReport(r => {
      if (r == null) return r;
      const newExpenses = [...r.expenses];
      let i = newExpenses.findIndex(e => e.category === expense.category);
      if (i < 0 || i >= newExpenses.length) return r;
      newExpenses[i] = expense;
      return { ...r, expenses: newExpenses };
    });
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Submit this:', report);
  }

  return (
    <form className='create-report-form-wrapper standard-form' onSubmit={handleSubmit}>
      <div className="form-body">
        <ResultDisplay result={recentResult} />
        <div className='transaction-inputs'>
          <h2>earnings</h2>
          {
            report.earnings.map(
              (earning, index) =>
              <EarningInput key={`earning-input-key-${earning.category}-${index}`} earning={earning} update={handleUpdateEarning} />
            )
          }
          <select>
            <option>add earning</option>
          </select>
        </div>
        <div className='transaction-inputs'>
          <h2>expenses</h2>
          {
            report.expenses.map(
              (expense, index) =>
              <ExpenseInput key={`expense-input-key-${expense.category}-${index}`} expense={expense} update={handleUpdateExpense} />
            )
          }
          <select>
            <option>add expense</option>
          </select>
        </div>
        <div>
          <ReportDisplayCard report={report} />
        </div>
      </div>
      <button type='submit' className='standard-button'>submit</button>
    </form>
  );
}