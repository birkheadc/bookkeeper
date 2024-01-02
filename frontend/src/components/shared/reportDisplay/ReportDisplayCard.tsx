import * as React from 'react';
import './ReportDisplayCard.css';
import { Report } from '../../../types/report/report';
import { Link } from 'react-router-dom';

interface IReportDisplayCardProps {
  report: Report
}
/**
 * 
 * @param {} props
 * @returns {JSX.Element | null}
 */
export default function ReportDisplayCard(props: IReportDisplayCardProps): JSX.Element | null {
  const report = props.report;
  return (
    <div className='report-display-card-wrapper'>
      <div className='report-display-card-top'>
        <span className='report-display-card-date'>{report.date.toSimpleString()}</span>
        <span className='report-display-card-total'>{CURRENCY_SYMBOL}{report.getTotalEarnings().toLocaleString()}</span>
        <div className='report-display-card-breakdowns'>
        {
          report.earnings.map(
            earning =>
            <div key={`report-display-card-earnings-key-${earning.category}`} className='report-display-card-breakdown-row earning-color'>
              <span>{earning.category}</span>
              <span>{earning.amount.toLocaleString()}</span>
            </div>
          )
        }
        {
          report.expenses.map(
            expense =>
            <div key={`report-display-card-expenses-key-${expense.category}`} className='report-display-card-breakdown-row expense-color'>
              <span>{expense.isIncludeInCash && '*'}{expense.category}</span>
              <span>-{expense.amount.toLocaleString()}</span>
            </div>
          )
        }
        </div>
      </div>
      <Link className='standard-button' to={`/create?date=${report.date.toSimpleString()}`}>Edit</Link>
    </div>
  );
}

// Todo: Eventually maybe one day make this a setting.
const CURRENCY_SYMBOL = '₩';