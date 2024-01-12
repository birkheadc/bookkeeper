import * as React from 'react';
import './ReportDisplayCard.css';
import { Report } from '../../../types/report/report';
import { Link } from 'react-router-dom';
import { useCurrency } from '../../../hooks/useCurrency/useCurrency';

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
  const { properties, getActualAmount } = useCurrency();
  return (
    <div className='report-display-card-wrapper'>
      <div className='report-display-card-top'>
        <span className='report-display-card-date'>{report.id.toSimpleString()}</span>
        <span className='report-display-card-total'>{properties.symbol}{getActualAmount(report.getTotalEarnings()).toLocaleString()}</span>
        <div className='report-display-card-breakdowns'>
        {
          report.earnings.map(
            (earning, index) =>
            {
              if (earning.amount !== 0) {
                return (
                  <div key={`report-display-card-earnings-key-${earning.category}-${index}`} className='report-display-card-breakdown-row earning-color'>
                    <span>{earning.category}</span>
                    <span>{getActualAmount(earning.amount).toLocaleString()}</span>
                  </div>
                );
              }
            }
          )
        }
        {
          report.expenses.map(
            (expense, index) =>
            {
              if (expense.amount !== 0) {
                return (
                  <div key={`report-display-card-expenses-key-${expense.category}-${index}`} className='report-display-card-breakdown-row expense-color'>
                    <span>{expense.isIncludeInCash && '*'}{expense.category}</span>
                    <span>-{getActualAmount(expense.amount).toLocaleString()}</span>
                  </div>
                );
              }
            }
          )
        }
        </div>
      </div>
      <Link className='standard-button' to={`/create?date=${report.id.toSimpleString()}`}>Edit</Link>
    </div>
  );
}