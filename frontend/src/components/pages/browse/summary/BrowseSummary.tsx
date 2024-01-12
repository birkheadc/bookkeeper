import * as React from 'react';
import './BrowseSummary.css'
import { ReportsSummary } from '../../../../types/report/reportsSummary';
import { useCurrency } from '../../../../hooks/useCurrency/useCurrency';
import { Report } from '../../../../types/report/report';

interface IBrowseSummaryProps {
  reports: Record<string, Report>
}

/**
*
* @returns {JSX.Element | null}
*/
export default function BrowseSummary(props: IBrowseSummaryProps): JSX.Element | null {
  const summary = ReportsSummary.fromRecord(props.reports);
  const { properties, getActualAmount } = useCurrency();

  return (
    <div className='browse-summary-wrapper'>
      <div className='browse-summary-row browse-summary-header'>
        <span>Total</span><span>{properties.symbol}{getActualAmount(summary.total).toLocaleString()}</span>
      </div>
      <div className='browse-summary-row browse-summary-header'>
        <span>Average</span><span>{properties.symbol}{getActualAmount(summary.average).toLocaleString()}</span>
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
              <td className='right-align'>{getActualAmount(earning.amount).toLocaleString()}</td>
              <td className='right-align'>{getActualAmount(earning.average).toLocaleString()}</td>
            </tr>
          )}
          {summary.expenses.map(
            expense =>
            <tr key={`browse-summary-expenses-key-${expense.category}`} className='expense-color'>
              <td>{expense.category}</td>
              <td className='right-align'>-{getActualAmount(expense.amount).toLocaleString()}</td>
              <td className='right-align'>-{getActualAmount(expense.average).toLocaleString()}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}