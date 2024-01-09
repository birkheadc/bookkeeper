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
      const newReport = { ...r };

      settings.categories.earningCategories.forEach(category => {
        if (category.isDefault && !newReport.earnings.some(e => e.category === category.name)) {
          newReport.earnings.push({ id: uuidv4(), date: r.date, category: category.name, amount: 0 });
          changed = true;
        }
      });

      settings.categories.expenseCategories.forEach(category => {
        if (newReport.expenses == null || report == null) return;
        if (category.isDefault && !newReport.expenses.some(e => e.category === category.name)) {
          newReport.expenses.push({ id: uuidv4(), date: r.date, category: category.name, amount: 0, isIncludeInCash: false });
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
      const newEarnings = [...r.earnings];
      let i = newEarnings.findIndex(e => e.id === earning.id);
      if (i < 0 || i >= newEarnings.length) return r;
      newEarnings[i] = earning;
      return { ...r, earnings: newEarnings };
    });
  }

  const handleUpdateExpense = (expense: Expense) => {
    setReport(r => {
      if (r == null) return r;
      const newExpenses = [...r.expenses];
      let i = newExpenses.findIndex(e => e.id === expense.id);
      if (i < 0 || i >= newExpenses.length) return r;
      newExpenses[i] = expense;
      return { ...r, expenses: newExpenses };
    });
  }

  const handleAddEarning = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;

    if (value === 'default') return;

    const category = (value === 'new') ? prompt('Enter name of new category') : value.substring(1);
    event.currentTarget.value = 'default';

    if (category == null) return;

    const newEarnings: Earning[] = [ ...report.earnings ];
    newEarnings.push({ id: uuidv4(), date: report.date, category: category, amount: 0 });
    setReport(r => r ? ({ ...r, earnings: newEarnings }): r);

  }

  const handleAddExpense = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;

    if (value === 'default') return;

    const category = (value === 'new') ? prompt('Enter name of new category') : value.substring(1);
    event.currentTarget.value = 'default';

    if (category == null) return;

    const newExpenses: Expense[] = [ ...report.expenses ];
    newExpenses.push({ id: uuidv4(), date: report.date, category: category, amount: 0, isIncludeInCash: false });
    setReport(r => r ? ({ ...r, expenses: newExpenses }): r);
  }

  const handleDeleteEarning = (id: string) => {
    const newEarnings: Earning[] = [ ...report.earnings ].filter(e => e.id !== id);
    setReport(r => r ? ({ ...r, earnings: newEarnings }): r);
  }

  const handleDeleteExpense = (id: string) => {
    const newExpenses: Expense[] = [ ...report.expenses ].filter(e => e.id !== id);
    setReport(r => r ? ({ ...r, expenses: newExpenses }): r);
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await addReportAndUpdateSettings(report);
    setRecentResult(result);
    if (result.wasSuccess) {
      nav(`/browse?date=${report.date.toSimpleString()}`);
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