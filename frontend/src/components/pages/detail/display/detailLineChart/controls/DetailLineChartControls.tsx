import * as React from 'react';
import './DetailLineChartControls.css'
import { BrowseViewMode } from '../../../../../../types/browse/browseViewMode';

interface IDetailLineChartControlsProps {
  mode: BrowseViewMode,
  changeMode: (mode: BrowseViewMode) => void
}

/**
*
* @returns {JSX.Element | null}
*/
export default function DetailLineChartControls(props: IDetailLineChartControlsProps): JSX.Element {

  return (
    <div className='detail-line-chart-controls-wrapper'>
      <button className={`standard-button detail-control-button${props.mode === BrowseViewMode.DAY ? ' active' : ''}`} type='button' onClick={() => props.changeMode(BrowseViewMode.DAY)}>day</button>
      <button className={`standard-button detail-control-button${props.mode === BrowseViewMode.WEEK ? ' active' : ''}`} type='button' onClick={() => props.changeMode(BrowseViewMode.WEEK)}>week</button>
      <button className={`standard-button detail-control-button${props.mode === BrowseViewMode.MONTH ? ' active' : ''}`} type='button' onClick={() => props.changeMode(BrowseViewMode.MONTH)}>month</button>
    </div>
  );
}