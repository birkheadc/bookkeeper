import * as React from 'react';
import './DetailSummary.css';
import { Report } from '../../../../../types/report/report';

interface IDetailSummaryProps {
  reports: Record<string, Report>
}
/**
 * 
 * @param {} props
 * @returns {JSX.Element | null}
 */
export default function DetailSummary(props: IDetailSummaryProps): JSX.Element {
  return (
    <div className='detail-summary-wrapper'>
      detail summary wrapper not yet implemented
    </div>
  );
}