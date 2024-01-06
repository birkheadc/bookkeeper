import * as React from 'react';
import './EarningInput.css'
import { Earning } from '../../../../../types/report/report';
import StandardFormLabeledInput from '../../../../forms/standardFormLabeledInput/StandardFormLabeledInput';

interface IEarningInputProps {
  earning: Earning,
  update: (earning: Earning) => void
}

/**
*
* @returns {JSX.Element | null}
*/
export default function EarningInput(props: IEarningInputProps): JSX.Element | null {

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {

  }

  const useCalculator = () => {

  }

  return (
    <div className='earning-input-wrapper transaction-input-wrapper'>
      <h3>{props.earning.category}</h3>
      <div className='standard-form-row'>
        <StandardFormLabeledInput type='number' label={'amount'} name={'amount'} value={props.earning.amount.toString()} handleChange={handleChangeAmount} />
        <button className='standard-button' type='button' onClick={useCalculator}>calc</button>
      </div>
    </div>
  );
}