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
  if (reports == null) return null;
  const [ start, end ] = calculateNumberEmptyCellsInMonth(reports, props.viewMode);
  return (
    <div className='browse-page-display-wrapper'>
      <div className='browse-page-display-reports-wrapper'>
        <BrowsePageDisplayDaysOfTheWeek viewMode={props.viewMode} />
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

function BrowsePageDisplayDaysOfTheWeek(props: { viewMode: BrowseViewMode }): JSX.Element | null {
  if (props.viewMode === BrowseViewMode.DAY) return null;
  return (
    <>
      <div className="browse-page-display-card-outer-wrapper">
        <div className='days-page-display-days-of-the-week-cell'>sunday</div>
      </div>
      <div className="browse-page-display-card-outer-wrapper">
        <div className='days-page-display-days-of-the-week-cell'>monday</div>
      </div>
      <div className="browse-page-display-card-outer-wrapper">
        <div className='days-page-display-days-of-the-week-cell'>tuesday</div>
      </div>
      <div className="browse-page-display-card-outer-wrapper">
        <div className='days-page-display-days-of-the-week-cell'>wednesday</div>
      </div>
      <div className="browse-page-display-card-outer-wrapper">
        <div className='days-page-display-days-of-the-week-cell'>thursday</div>
      </div>
      <div className="browse-page-display-card-outer-wrapper">
        <div className='days-page-display-days-of-the-week-cell'>friday</div>
      </div>
      <div className="browse-page-display-card-outer-wrapper">
        <div className='days-page-display-days-of-the-week-cell'>saturday</div>
      </div>
    </>
  );
}

function calculateNumberEmptyCellsInMonth(reports: ReportDictionary, viewMode: BrowseViewMode): [ number, number ] {
  if (viewMode !== BrowseViewMode.MONTH) return [ 0, 0 ];

  const date = reports[Object.keys(reports)[0]].date;

  const first = new Date(date);
  first.setDate(1);
  const start = first.getDay();

  const last = new Date(date);
  last.setMonth(first.getMonth() + 1);
  last.setDate(0);
  const end = 6 - last.getDay();

  return [ start, end ];
}