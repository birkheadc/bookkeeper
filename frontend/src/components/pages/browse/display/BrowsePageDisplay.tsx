import * as React from 'react';
import './BrowsePageDisplay.css'
import { ReportDictionary } from '../../../../types/report/report';
import ReportDisplayCard from '../../../shared/reportDisplay/ReportDisplayCard';

interface IBrowsePageDisplayProps {
  reports: ReportDictionary | undefined
}

/**
*
* @returns {JSX.Element | null}
*/
export default function BrowsePageDisplay(props: IBrowsePageDisplayProps): JSX.Element | null {
  const reports = props.reports;
  return (
    <div className='browse-page-display-wrapper'>
      { reports && Object.keys(reports).map(
        date =>
        <div className='browse-page-display-card-outer-wrapper'>
          <ReportDisplayCard report={reports[date]} />
        </div>
      )}
    </div>
  );
}