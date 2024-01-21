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
  const { properties, format } = useCurrency();

  return (
    <div className='browse-summary-wrapper'>
      <div className='browse-summary-row browse-summary-header'>
        <span>total</span><span>{properties.symbol}{format(summary.totalGross)}</span>
      </div>
      <div className='browse-summary-row browse-summary-header'>
        <span>average</span><span>{properties.symbol}{format(summary.averageGross)}</span>
      </div>
      <table className='browse-summary-table'>
        <thead>
          <tr className='browse-summary-table-headers'>
            <th>category</th>
            <th className='right-align'>total</th>
            <th className='right-align'>%</th>
          </tr>
        </thead>
        <tbody>
          {summary.earnings.map(
            earning =>
            <tr key={`browse-summary-earnings-key-${earning.category}`} className='earning-color'>
              <td>{earning.category}</td>
              <td className='right-align'>{format(earning.amount)}</td>
              <td className='right-align'>{((earning.amount / summary.totalGross) * 100).toFixed(2)}</td>
            </tr>
          )}
          {summary.expenses.map(
            expense =>
            <tr key={`browse-summary-expenses-key-${expense.category}`} className='expense-color'>
              <td>{expense.category}</td>
              <td className='right-align'>-{format(expense.amount)}</td>
              <td className='right-align'>{((expense.amount / (summary.totalGross - summary.totalNet)) * 100).toFixed(2)}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}