import * as React from 'react';
import './BrowsePageDisplay.css'
import { ReportDictionary } from '../../../../types/report/report';
import ReportDisplayCard from '../../../shared/reportDisplay/ReportDisplayCard';
import EmptyDisplayCards from './emptyDisplayCards/EmptyDisplayCards';
import { BrowseViewMode } from '../../../../types/browse/browseViewMode';

interface IBrowsePageDisplayProps {
  reports: ReportDictionary | undefined,
  viewMode: BrowseViewMode
}

/**
*
* @returns {JSX.Element | null}
*/
export default function BrowsePageDisplay(props: IBrowsePageDisplayProps): JSX.Element | null {
  const reports = props.reports;
  const [ start, end ] = calculateNumberEmptyCellsInMonth(reports, props.viewMode);
  return (
    <div className='browse-page-display-wrapper'>
      <BrowsePageDisplayDaysOfTheWeek />
      <div className='browse-page-display-reports-wrapper'>
        <EmptyDisplayCards num={start} />
        { reports && Object.keys(reports).map(
          date =>
          <div key={`browse-page-display-card-key-${date}`} className='browse-page-display-card-outer-wrapper'>
            <ReportDisplayCard report={reports[date]} />
          </div>
        )}
        <EmptyDisplayCards num={end} />
      </div>
    </div>
  );
}

function BrowsePageDisplayDaysOfTheWeek(): JSX.Element {
  return (
    <div></div>
  );
}

function calculateNumberEmptyCellsInMonth(reports: ReportDictionary | undefined, viewMode: BrowseViewMode): [ number, number ] {
  if (reports == null || viewMode !== BrowseViewMode.MONTH) return [ 0, 0 ];

  const date = reports[Object.keys(reports)[0]].date;

  const first = new Date(date);
  first.setDate(1);
  const start = first.getDay();

  const last = new Date(date);
  last.setMonth(first.getMonth() + 1);
  last.setDate(0);
  console.log(last);
  const end = 6 - last.getDay();

  return [ start, end ];
}