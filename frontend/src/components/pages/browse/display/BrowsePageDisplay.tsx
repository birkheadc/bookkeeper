import * as React from 'react';
import './BrowsePageDisplay.css'
import { Report, ReportDictionary } from '../../../../types/report/report';
import ReportDisplayCard from '../../../shared/reportDisplay/ReportDisplayCard';
import EmptyDisplayCards from './emptyDisplayCards/EmptyDisplayCards';
import { BrowseViewMode } from '../../../../types/browse/browseViewMode';

interface IBrowsePageDisplayProps {
  reports: ReportDictionary,
  viewMode: BrowseViewMode
}

/**
*
* @returns {JSX.Element | null}
*/
export default function BrowsePageDisplay(props: IBrowsePageDisplayProps): JSX.Element | null {
  const reports: Report[] = Report.fromReportDictionary(props.reports);

  const [ start, end ] = calculateNumberEmptyCellsInMonth(reports, props.viewMode);
  
  return (
    <div className='browse-page-display-wrapper'>
      <div className={`browse-page-display-reports-wrapper${props.viewMode === BrowseViewMode.DAY ? ' single-column' : ''}`}>
        <BrowsePageDisplayDaysOfTheWeek viewMode={props.viewMode} />
        <EmptyDisplayCards num={start} />
        {reports.map(
          report =>
          <div key={`browse-page-display-card-key-${report.date}`} className='browse-page-display-card-outer-wrapper'>
            <ReportDisplayCard report={report} />
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
      <div className="browse-page-display-card-outer-wrapper days-of-the-week">
        <div className='days-page-display-days-of-the-week-cell'>sunday</div>
      </div>
      <div className="browse-page-display-card-outer-wrapper days-of-the-week">
        <div className='days-page-display-days-of-the-week-cell'>monday</div>
      </div>
      <div className="browse-page-display-card-outer-wrapper days-of-the-week">
        <div className='days-page-display-days-of-the-week-cell'>tuesday</div>
      </div>
      <div className="browse-page-display-card-outer-wrapper days-of-the-week">
        <div className='days-page-display-days-of-the-week-cell'>wednesday</div>
      </div>
      <div className="browse-page-display-card-outer-wrapper days-of-the-week">
        <div className='days-page-display-days-of-the-week-cell'>thursday</div>
      </div>
      <div className="browse-page-display-card-outer-wrapper days-of-the-week">
        <div className='days-page-display-days-of-the-week-cell'>friday</div>
      </div>
      <div className="browse-page-display-card-outer-wrapper days-of-the-week">
        <div className='days-page-display-days-of-the-week-cell'>saturday</div>
      </div>
    </>
  );
}

function calculateNumberEmptyCellsInMonth(reports: Report[], viewMode: BrowseViewMode): [ number, number ] {
  if (viewMode !== BrowseViewMode.MONTH) return [ 0, 0 ];
  
  const date = reports[0]?.date;
  if (date == null) return [ 0, 0 ];

  const first = new Date(date);
  first.setDate(1);
  const start = first.getDay();

  const last = new Date(date);
  last.setMonth(first.getMonth() + 1);
  last.setDate(0);
  const end = 6 - last.getDay();

  return [ start, end ];
}