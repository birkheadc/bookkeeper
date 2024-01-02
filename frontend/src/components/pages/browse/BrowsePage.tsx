import * as React from 'react';
import './BrowsePage.css'
import { ReportDictionary } from '../../../types/report/report';
import { ReportsContext } from '../../../app/contexts/reports/ReportsContext';
import ResultDisplay from '../../resultDisplay/ResultDisplay';
import { Result } from '../../../types/result/result';

interface IBrowsePageProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function BrowsePage(props: IBrowsePageProps): JSX.Element | null {

  const [ dates, setDates ] = React.useState<Date[]>([ new Date() ]);
  const [ reports, setReports ] = React.useState<ReportDictionary | undefined>(undefined);
  const [ recentResult, setRecentResult ] = React.useState<Result | undefined>(undefined);

  const { getReports } = React.useContext(ReportsContext);

  React.useEffect(() => {
    (async function getReportsOnDateChange() {
      const result = await getReports(dates);
      setRecentResult(result);
      if (result.wasSuccess && result.body != null) {
        setReports(result.body);
      } 
    })();
  }, [ dates ]);

  return (
    <main className='browse-page-wrapper'>
      <h1>browse</h1>
      <ResultDisplay result={recentResult} />
      { reports && Object.keys(reports).map(
        date =>
        <div key={`report-key-${date}`}>
          {reports[date].date.toString()}
          {reports[date].earnings[0].category } : {reports[date].earnings[0].amount}
        </div>
      )}
    </main>
  );
}