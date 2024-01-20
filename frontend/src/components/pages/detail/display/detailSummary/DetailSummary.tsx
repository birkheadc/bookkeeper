import * as React from 'react';
import './DetailSummary.css';
import { Report } from '../../../../../types/report/report';
import { useCurrency } from '../../../../../hooks/useCurrency/useCurrency';
import { ReportsSummary } from '../../../../../types/report/reportsSummary';

interface IDetailSummaryProps {
  summary: ReportsSummary
}
/**
 * 
 * @param {} props
 * @returns {JSX.Element | null}
 */
export default function DetailSummary(props: IDetailSummaryProps): JSX.Element {
  const summary = props.summary;
  const { properties, format } = useCurrency();
  
  return (
    <div className='detail-summary-wrapper'>
      <div>
        <h2>gross</h2>
        <div className='browse-summary-row browse-summary-header'>
          <span>total</span><span>{properties.symbol}{format(summary.totalGross).toLocaleString()}</span>
        </div>
        <div className='browse-summary-row browse-summary-header'>
          <span>average</span><span></span>
        </div>
        <div className='browse-summary-row'>
          <span>day</span><span>{properties.symbol}{format(summary.averageGross)}</span>
        </div>
        <div className='browse-summary-row'>
          <span>month</span><span>{properties.symbol}{format(summary.averageGross * 365 / 12)}</span>
        </div>
        <div className='browse-summary-row'>
          <span>year</span><span>{properties.symbol}{format(summary.averageGross * 365)}</span>
        </div>
      </div>
      <div>
        <h2>net</h2>
        <div className='browse-summary-row browse-summary-header'>
          <span>total</span><span>{properties.symbol}{format(summary.totalNet).toLocaleString()}</span>
        </div>
        <div className='browse-summary-row browse-summary-header'>
          <span>average</span><span></span>
        </div>
        <div className='browse-summary-row'>
          <span>day</span><span>{properties.symbol}{format(summary.averageNet)}</span>
        </div>
        <div className='browse-summary-row'>
          <span>month</span><span>{properties.symbol}{format(summary.averageNet * 365 / 12)}</span>
        </div>
        <div className='browse-summary-row'>
          <span>year</span><span>{properties.symbol}{format(summary.averageNet * 365)}</span>
        </div>
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
              <td className='right-align'>{(earning.amount / summary.totalGross * 100).toFixed(2)}</td>
            </tr>
          )}
          {summary.expenses.map(
            expense =>
            <tr key={`browse-summary-expenses-key-${expense.category}`} className='expense-color'>
              <td>{expense.category}</td>
              <td className='right-align'>-{format(expense.amount)}</td>
              <td className='right-align'>{(expense.amount / (summary.totalGross - summary.totalNet) * 100).toFixed(2)}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}