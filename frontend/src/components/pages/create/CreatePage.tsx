import * as React from 'react';
import './CreatePage.css'
import CreateReportForm from './form/CreateReportForm';
import CreatePageControls from './controls/CreatePageControls';
import { useSearchParams } from 'react-router-dom';
import { ExtendedDate } from '../../../types/date/extendedDate';
import { ReportsContext } from '../../../app/contexts/reports/ReportsContext';
import { Result } from '../../../types/result/result';
import { Report } from '../../../types/report/report';
import ResultDisplay from '../../resultDisplay/ResultDisplay';
import ReportDisplayCard from '../../shared/reportDisplay/ReportDisplayCard';

interface ICreatePageProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function CreatePage(props: ICreatePageProps): JSX.Element | null {

  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ date, setDate ] = React.useState<ExtendedDate>(ExtendedDate.fromSearchParamsOrToday(searchParams).date);

  React.useEffect(function setDefaultSearchParamsIfMissing() {
    const { date, newSearchParams } = ExtendedDate.fromSearchParamsOrToday(searchParams);
    setDate(date);
    setSearchParams(newSearchParams);
  }, [ searchParams ]);

  return (
    <main className='create-page-wrapper'>
      <h1>create</h1>
      <CreatePageControls date={date} />
      <CreateReportForm date={date} />
    </main>
  );
}