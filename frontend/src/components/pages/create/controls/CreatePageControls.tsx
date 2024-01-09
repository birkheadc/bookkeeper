import * as React from 'react';
import './CreatePageControls.css'
import { useSearchParams } from 'react-router-dom';
import { ExtendedDate } from '../../../../types/date/extendedDate';
import { BrowseViewMode } from '../../../../types/browse/browseViewMode';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface ICreatePageControlsProps {
  date: ExtendedDate
}

/**
*
* @returns {JSX.Element | null}
*/
export default function CreatePageControls(props: ICreatePageControlsProps): JSX.Element | null {

  const [ searchParams, setSearchParams ] = useSearchParams();
  const [ date, setDate ] = React.useState<string>(props.date.toSimpleString());

  if (date == null) return null;

  const changeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.currentTarget.value;
    setDate(date);
  }

  const goBack = () => {
    seek(-1);
  }

  const goForward = () => {
    seek(1);
  }

  const seek = (n: number) => {
    const newDate = new ExtendedDate(date);
    newDate.addBrowseViewMode(BrowseViewMode.DAY, n);
    setDate(newDate.toSimpleString());
    searchParams.set('date', newDate.toSimpleString());
    setSearchParams(searchParams);
  }

  const goToDate = (event: React.FormEvent) => {
    event.preventDefault();
    searchParams.set('date', date);
    setSearchParams(searchParams);
  }

  return (
    <div className='create-page-controls-wrapper'>
      <form className='browse-date-controls' onSubmit={goToDate}>
        <button className='standard-button' type='button' onClick={goBack}><ArrowLeftIcon width={20} /></button>
        <input className='standard-input' onBlur={goToDate} onChange={changeDate} onSubmit={goToDate} value={date} type='date'></input>
        <button className='standard-button' type='button' onClick={goForward}><ArrowRightIcon width={20} /></button>
        <button className='hidden-submit-button' type='submit'></button>
      </form>
    </div>
  );
}