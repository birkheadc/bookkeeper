import * as React from 'react';
import './CreateReportForm.css'
import ReportDisplayCard from '../../../shared/reportDisplay/ReportDisplayCard';
import { Report } from '../../../../types/report/report';

interface ICreateReportFormProps {
  report: Report
}

/**
*
* @returns {JSX.Element | null}
*/
export default function CreateReportForm(props: ICreateReportFormProps): JSX.Element | null {
  return (
    <form className='create-report-form-wrapper standard-form'>
      <div>
        <h2>earnings</h2>
      </div>
      <div>
        <h2>expenses</h2>
      </div>
      <ReportDisplayCard report={props.report} />
    </form>
  );
}