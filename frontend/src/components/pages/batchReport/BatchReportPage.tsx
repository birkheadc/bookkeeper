import * as React from 'react';
import './BatchReportPage.css'
import BatchReportForm from './form/BatchReportForm';

interface IBatchReportPageProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function BatchReportPage(props: IBatchReportPageProps): JSX.Element | null {
  return (
    <main className='batch-report-page'>
      <h1>batch report</h1>
      <BatchReportForm />
    </main>
  );
}