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
import { SettingsContext } from '../../../app/contexts/settings/SettingsContext';
import { UserSettings } from '../../../types/settings/userSettings';
import { BrowseViewMode } from '../../../types/browse/browseViewMode';

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
  const [ browseOptions, setBrowseOptions ] = React.useState<BrowseOptions | undefined>(BrowseOptions.fromSearchParams(searchParams));

  const { settings } = React.useContext(SettingsContext);

  React.useEffect(function setDefaultSearchParamsIfMissing() {
    if (settings == null) return;
    if (!searchParams.has('date')) {
      searchParams.append('date', new ExtendedDate().toSimpleString());
    }
    if (!searchParams.has('mode')) {
      searchParams.append('mode', settings.general.defaultViewMode ?? BrowseViewMode.DAY);
    }
    setSearchParams(searchParams);
  }, [ searchParams, settings ]);

  React.useEffect(function updateBrowseOptionsOnSearchParamsChange() {
    setBrowseOptions(BrowseOptions.fromSearchParams(searchParams));
  }, [ searchParams ]);

  React.useEffect(() => {
    setReports(undefined);
    if (browseOptions == null) return;
    (async function getReportsOnDateChange() {
      const result = await getReports(browseOptions.getDates());
      setRecentResult(result);
      if (result.wasSuccess && result.body != null) {
        setReports(result.body);
      } 
    })();
  }, [ browseOptions ]);

  if (settings == null || browseOptions == null) return null;

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