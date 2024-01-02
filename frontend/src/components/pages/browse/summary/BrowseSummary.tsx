import * as React from 'react';
import './BrowseSummary.css'
import { ReportDictionary } from '../../../../types/report/report';
import { ReportsSummary } from '../../../../types/report/reportsSummary';

interface IBrowseSummaryProps {
  reports: ReportDictionary | undefined
}

/**
*
* @returns {JSX.Element | null}
*/
export default function BrowseSummary(props: IBrowseSummaryProps): JSX.Element | null {
  if (props.reports == null) return null;
  const summary = ReportsSummary.fromReportDictionary(props.reports);

  return (
    <div className='browse-summary-wrapper'>
      <div className='browse-summary-row browse-summary-header'>
        <span>Total</span><span>{CURRENCY_SYMBOL}{summary.total.toLocaleString()}</span>
      </div>
      <div className='browse-summary-row browse-summary-header'>
        <span>Average</span><span>{CURRENCY_SYMBOL}{summary.average.toLocaleString()}</span>
      </div>
      <table>
        {/*todo*/}
      </table>
    </div>
  );
}

// Todo: Eventually maybe one day make this a setting.
const CURRENCY_SYMBOL = '₩';