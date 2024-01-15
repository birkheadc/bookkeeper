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
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

interface ICreateReportFormProps {
  date: ExtendedDate
}

/**
*
* @returns {JSX.Element | null}
*/
export default function CreateReportForm(props: ICreateReportFormProps): JSX.Element | null {
  const { getReport, addReport } = React.useContext(ReportsContext);
  const [ report, setReport ] = React.useState<Report | undefined>();
  const [ recentResult, setRecentResult ] = React.useState<Result | undefined>();

  const { settings, updateSettings } = React.useContext(SettingsContext);

  const nav = useNavigate();

  React.useEffect(() => {
    (async function fetchReportOnDateChange() {
      if (props.date == null) return;
      const result = await getReport(props.date);
      setRecentResult(result);
      if (result.wasSuccess && result.body != null) {
        console.log('Got report: ', result.body);
        setReport(result.body);
      }
    })();
  }, [ props.date ]);

  React.useEffect(function addDefaultTransactionCategoriesToFetchedReport() {
    if (settings == null) return;
    if (report == null) return;
    setReport(r => {
      if (r == null) return r;
      if (r.earnings.length > 0 || r.expenses.length > 0) return r;
      let changed = false;
      const newReport = r.copy();
      settings.categories.earningCategories.forEach(category => {
        if (category.isDefault && !newReport.earnings.some(e => e.category === category.name)) {
          newReport.earnings.push(Earning.fromDto({ id: uuidv4(), reportDate: r.id.toDto(), category: category.name, amount: 0 }));
          changed = true;
        }
      });

      settings.categories.expenseCategories.forEach(category => {
        if (newReport.expenses == null || report == null) return;
        if (category.isDefault && !newReport.expenses.some(e => e.category === category.name)) {
          newReport.expenses.push(Expense.fromDto({ id: uuidv4(), reportDate: r.id.toDto(), category: category.name, amount: 0, isIncludeInCash: false }));
          changed = true;
        }
      });
      return changed ? newReport : r;
    })
  }, [ report, settings ] );

  if (report == null) return null;

  const handleUpdateEarning = (earning: Earning) => {
    setReport(r => {
      if (r == null) return r;
      const newReport = r.copy();
      const newEarnings = newReport.earnings;
      let i = newEarnings.findIndex(e => e.id === earning.id);
      if (i < 0 || i >= newEarnings.length) return r;
      newEarnings[i] = earning;
      return newReport;
    });
  }

  const handleUpdateExpense = (expense: Expense) => {
    setReport(r => {
      if (r == null) return r;
      const newReport = r.copy();
      const newExpenses = newReport.expenses;
      let i = newExpenses.findIndex(e => e.id === expense.id);
      if (i < 0 || i >= newExpenses.length) return r;
      newExpenses[i] = expense;
      return newReport;
    });
  }

  const handleAddEarning = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;

    if (value === 'default') return;

    const category = (value === 'new') ? prompt('Enter name of new category') : value.substring(1);
    event.currentTarget.value = 'default';

    if (category == null) return;
    
    setReport(r => {
      if (r == null) return r;
      const newReport = r.copy();
      const newEarnings = newReport.earnings;
      newEarnings.push(Earning.fromDto({ id: uuidv4(), reportDate: report.id.toDto(), category: category, amount: 0 }))
      return newReport;
    });
  }

  const handleAddExpense = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;

    if (value === 'default') return;

    const category = (value === 'new') ? prompt('Enter name of new category') : value.substring(1);
    event.currentTarget.value = 'default';

    if (category == null) return;

    setReport(r => {
      if (r == null) return r;
      const newReport = r.copy();
      const newExpenses = newReport.expenses;
      newExpenses.push(Expense.fromDto({ id: uuidv4(), reportDate: report.id.toDto(), category: category, amount: 0, isIncludeInCash: false }))
      return newReport;
    });
  }

  const handleDeleteEarning = (id: string) => {
    setReport(r => {
      if (r == null) return r;
      const newReport = r.copy();
      const newEarnings = newReport.earnings.filter(e => e.id !== id);
      newReport.earnings = newEarnings;
      return newReport;
    });
  }

  const handleDeleteExpense = (id: string) => {
    setReport(r => {
      if (r == null) return r;
      const newReport = r.copy();
      const newExpenses = newReport.expenses.filter(e => e.id !== id);
      newReport.expenses = newExpenses;
      return newReport;
    });
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await addReportAndUpdateSettings(report);
    setRecentResult(result);
    if (result.wasSuccess) {
      nav(`/browse?date=${report.id.toSimpleString()}`);
    }
  }

  const addReportAndUpdateSettings = async (report: Report): Promise<Result> => {
    const reportResult = await addReport(report);

    if (settings != null) {
      const newSettings = { ...settings };
      report.earnings.forEach(earning => {
        const categories = newSettings.categories.earningCategories;
        if (!categories.some(c => c.name === earning.category)) {
          categories.push({ name: earning.category, isDefault: false });
        }
      });
      report.expenses.forEach(expense => {
        const categories = newSettings.categories.expenseCategories;
        if (!categories.some(c => c.name === expense.category)) {
          categories.push({ name: expense.category, isDefault: false });
        }
        const subCategory = expense.subCategory;
        if (subCategory != null) {
          const index = categories.findIndex(c => (c.name === expense.category && c.subcategories && !c.subcategories.includes(subCategory)));
          if (index !== -1) {
            categories[index].subcategories?.push(subCategory);
          }
        }
      });
      await updateSettings(newSettings);
    }
    return reportResult;
  }

  return (
    <form className='create-report-form-wrapper standard-form' onSubmit={handleSubmit}>
      <ResultDisplay result={recentResult} />
      <div className="form-body">
        <div className='create-report-form-subsection transaction-inputs'>
          <h2>earnings</h2>
          {
            report.earnings.map(
              (earning) =>
              <EarningInput key={`earning-input-key-${earning.id}`} earning={earning} update={handleUpdateEarning} delete={() => handleDeleteEarning(earning.id)} />
            )
          }
          <select className='standard-input' onChange={handleAddEarning}>
            <option value='default'>add earning</option>
            {
              settings?.categories.earningCategories.map(
                category =>
                <option key={`add-earning-option-key-${category.name}`} value={`$${category.name}`}>{category.name}</option>
              )
            }
            <option value='new'>create new</option>
          </select>
        </div>
        <div className='create-report-form-subsection transaction-inputs'>
          <h2>expenses</h2>
          {
            report.expenses.map(
              (expense) =>
              <ExpenseInput key={`expense-input-key-${expense.id}`} expense={expense} update={handleUpdateExpense} delete={() => handleDeleteExpense(expense.id)} />
            )
          }
          <select className='standard-input' onChange={handleAddExpense}>
            <option value='default'>add expense</option>
            {
              settings?.categories.expenseCategories.map(
                category =>
                <option key={`add-expense-option-key-${category.name}`} value={`$${category.name}`}>{category.name}</option>
              )
            }
            <option value='new'>create new</option>
          </select>
        </div>
        <div className='create-report-form-subsection'>
          <h2>preview</h2>
          <ReportDisplayCard report={report} />
        </div>
      </div>
      <button type='submit' className='standard-button'>submit</button>
    </form>
  );
}