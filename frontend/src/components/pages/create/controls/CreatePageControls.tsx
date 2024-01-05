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
  const date = props.date;

  if (date == null) return null;

  const changeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.currentTarget.value;
    searchParams.set('date', date);
    setSearchParams(searchParams);
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
    searchParams.set('date', newDate.toSimpleString());
    setSearchParams(searchParams);
  }

  return (
    <div className='create-page-controls-wrapper'>
      <div className='browse-date-controls'>
        <button className='standard-button' type='button' onClick={goBack}><ArrowLeftIcon width={20} /></button>
        <input className='standard-input' onChange={changeDate} value={date.toSimpleString()} type='date'></input>
        <button className='standard-button' type='button' onClick={goForward}><ArrowRightIcon width={20} /></button>
      </div>
    </div>
  );
}