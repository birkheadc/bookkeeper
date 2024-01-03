import * as React from 'react';
import './BrowseSummary.css'
import { ReportDictionary } from '../../../../types/report/report';
import { ReportsSummary } from '../../../../types/report/reportsSummary';

interface IBrowseSummaryProps {
  reports: ReportDictionary | undefined
}

/**
*
* @returns {JSX.Element | null}
*/
export default function BrowseSummary(props: IBrowseSummaryProps): JSX.Element | null {
  if (props.reports == null) return null;
  const summary = ReportsSummary.fromReportDictionary(props.reports);

  return (
    <div className='browse-summary-wrapper'>
      <div className='browse-summary-row browse-summary-header'>
        <span>Total</span><span>{CURRENCY_SYMBOL}{summary.total.toLocaleString()}</span>
      </div>
      <div className='browse-summary-row browse-summary-header'>
        <span>Average</span><span>{CURRENCY_SYMBOL}{summary.average.toLocaleString()}</span>
      </div>
      <table className='browse-summary-table'>
        <thead>
          <tr className='browse-summary-table-headers'>
            <th>category</th>
            <th className='right-align'>total</th>
            <th className='right-align'>average</th>
          </tr>
        </thead>
        <tbody>
          {summary.earnings.map(
            earning =>
            <tr key={`browse-summary-earnings-key-${earning.category}`} className='earning-color'>
              <td>{earning.category}</td>
              <td className='right-align'>{earning.amount}</td>
              <td className='right-align'>{earning.average}</td>
            </tr>
          )}
          {summary.expenses.map(
            expense =>
            <tr key={`browse-summary-expenses-key-${expense.category}`} className='expense-color'>
              <td>{expense.category}</td>
              <td className='right-align'>-{expense.amount}</td>
              <td className='right-align'>-{expense.average}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Todo: Eventually maybe one day make this a setting.
const CURRENCY_SYMBOL = '₩';