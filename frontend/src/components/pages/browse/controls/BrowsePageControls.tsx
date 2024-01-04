import * as React from 'react';
import './BrowsePageControls.css'
import { useSearchParams } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { BrowseOptions } from '../../../../types/browse/browseOptions';
import { ExtendedDate } from '../../../../types/date/extendedDate';

interface IBrowsePageControlsProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function BrowsePageControls(props: IBrowsePageControlsProps): JSX.Element | null {

  const [ searchParams, setSearchParams ] = useSearchParams();
  const browseOptions = BrowseOptions.fromSearchParams(searchParams);

  const changeViewMode = (event: React.PointerEvent<HTMLButtonElement>) => {
    const name = event.currentTarget.name;
    searchParams.set('mode', name);
    setSearchParams(searchParams);
  }

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
    if (browseOptions == null) return;
    const newDate = new ExtendedDate(browseOptions.date);
    newDate.addBrowseViewMode(browseOptions.viewMode, n);
    searchParams.set('date', newDate.toSimpleString());
    setSearchParams(searchParams);
  }

  if (browseOptions == null) return null;

  return (
    <div className='browse-page-controls-wrapper'>
      <div className='browse-view-mode-buttons'>
        <button className={`standard-button${browseOptions.viewMode === 'day' ? ' active' : ''}`} name='day' type='button' onClick={changeViewMode}>day</button>
        <button className={`standard-button${browseOptions.viewMode === 'week' ? ' active' : ''}`} name='week' type='button' onClick={changeViewMode}>week</button>
        <button className={`standard-button${browseOptions.viewMode === 'month' ? ' active' : ''}`} name='month' type='button' onClick={changeViewMode}>month</button>
      </div>
      <div className='browse-date-controls'>
        <button className='standard-button' type='button' onClick={goBack}><ArrowLeftIcon width={20} /></button>
        <input className='standard-input' onChange={changeDate} value={browseOptions.date.toSimpleString()} type='date'></input>
        <button className='standard-button' type='button' onClick={goForward}><ArrowRightIcon width={20} /></button>
      </div>
    </div>
  );
}