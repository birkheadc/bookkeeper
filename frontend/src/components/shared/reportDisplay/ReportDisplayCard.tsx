import * as React from 'react';
import './ReportDisplayCard.css';
import { Report } from '../../../types/report/report';

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
      {report.date.toSimpleString()}
    </div>
  );
}