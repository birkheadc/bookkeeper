import * as React from 'react';
import './DetailBarChartControls.css';
import { BreakdownMode } from '../../../../../../types/detail/breakdownMode';

interface IDetailBarChartControlsProps {
  mode: BreakdownMode,
  changeMode: (mode: BreakdownMode) => void
}
/**
 * 
 * @param {} props
 * @returns {JSX.Element | null}
 */
export default function DetailBarChartControls(props: IDetailBarChartControlsProps): JSX.Element {
  return (
    <div className='detail-bar-chart-controls-wrapper'>
      <button className={`standard-button detail-control-button${props.mode === BreakdownMode.DAY_OF_WEEK ? ' active' : ''}`} type='button' onClick={() => props.changeMode(BreakdownMode.DAY_OF_WEEK)}>day of week</button>
      <button className={`standard-button detail-control-button${props.mode === BreakdownMode.DAY_OF_MONTH ? ' active' : ''}`} type='button' onClick={() => props.changeMode(BreakdownMode.DAY_OF_MONTH)}>day of month</button>
      <button className={`standard-button detail-control-button${props.mode === BreakdownMode.MONTH ? ' active' : ''}`} type='button' onClick={() => props.changeMode(BreakdownMode.MONTH)}>month</button>
    </div>
  );
}