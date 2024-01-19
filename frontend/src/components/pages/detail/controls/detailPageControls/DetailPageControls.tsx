import * as React from 'react';
import './DetailPageControls.css'
import { useSearchParams } from 'react-router-dom';
import { ExtendedDate } from '../../../../../types/date/extendedDate';
import StandardFormLabeledInput from '../../../../forms/standardFormLabeledInput/StandardFormLabeledInput';

interface IDetailPageControlsProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function DetailPageControls(props: IDetailPageControlsProps): JSX.Element | null {

  const [ searchParams, setSearchParams ] = useSearchParams();

  const [ startDate, setStartDate ] = React.useState<string>(ExtendedDate.fromStringOrNull(searchParams.get('startDate'))?.toSimpleString() ?? '');
  const [ endDate, setEndDate ] = React.useState<string>(ExtendedDate.fromStringOrNull(searchParams.get('endDate'))?.toSimpleString() ?? '');

  const changeStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.currentTarget.value;
    setStartDate(date);
  }

  const changeEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.currentTarget.value;
    setEndDate(date);
  }

  const updateSearchParams = () => {
    if (startDate !== '') searchParams.set('startDate', startDate);
    if (endDate !== '') searchParams.set('endDate', endDate);
    setSearchParams(searchParams);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateSearchParams();
  }

  return (
    <form className='detail-page-controls-wrapper standard-form' onSubmit={handleSubmit}>
    <div className='standard-form-row'>
      <StandardFormLabeledInput type='date' label={'from'} name={'details-page-controls-from'} value={startDate} handleChange={changeStartDate} />
      <StandardFormLabeledInput type='date' label={'to'} name={'details-page-controls-to'} value={endDate} handleChange={changeEndDate} />
    </div>
    <button className='standard-button' type='submit'>submit</button>
  </form>
  );
}