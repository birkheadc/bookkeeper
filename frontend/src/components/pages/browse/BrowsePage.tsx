import * as React from 'react';
import './BrowsePage.css'
import { ReportDictionary } from '../../../types/report/report';
import { ReportsContext } from '../../../app/contexts/reports/ReportsContext';
import ResultDisplay from '../../resultDisplay/ResultDisplay';
import { Result } from '../../../types/result/result';
import { BrowseOptions } from '../../../types/browse/browseOptions';
import BrowsePageDisplay from './display/BrowsePageDisplay';
import { useSearchParams } from 'react-router-dom';
import BrowsePageControls from './controls/BrowsePageControls';
import { ExtendedDate } from '../../../types/date/extendedDate';
import BrowseSummary from './summary/BrowseSummary';

interface IBrowsePageProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function BrowsePage(props: IBrowsePageProps): JSX.Element | null {

  const [ reports, setReports ] = React.useState<ReportDictionary>();
  const [ recentResult, setRecentResult ] = React.useState<Result>();

  const { getReports } = React.useContext(ReportsContext);

  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ browseOptions, setBrowseOptions ] = React.useState<BrowseOptions>(BrowseOptions.fromSearchParams(searchParams));

  React.useEffect(function setDefaultSearchParamsIfMissing() {
    if (!searchParams.has('date')) {
      searchParams.append('date', new ExtendedDate().toSimpleString());
    }
    if (!searchParams.has('mode')) {
      searchParams.append('mode', DEFAULT_MODE);
    }
    setSearchParams(searchParams);
  }, [ searchParams ]);

  React.useEffect(function updateBrowseOptionsOnSearchParamsChange() {
    setBrowseOptions(BrowseOptions.fromSearchParams(searchParams));
  }, [ searchParams ]);

  React.useEffect(() => {
    setReports(undefined);
    (async function getReportsOnDateChange() {
      const result = await getReports(browseOptions.getDates());
      setRecentResult(result);
      if (result.wasSuccess && result.body != null) {
        setReports(result.body);
      } 
    })();
  }, [ browseOptions ]);

  return (
    <main className='browse-page-wrapper'>
      <h1>browse</h1>
      <ResultDisplay result={recentResult} />
      <BrowsePageControls />
      <BrowseSummary reports={reports} />
      <BrowsePageDisplay reports={reports} viewMode={browseOptions.viewMode} />
    </main>
  );
}

// Todo: This needs to come from settings.
const DEFAULT_MODE = 'day';