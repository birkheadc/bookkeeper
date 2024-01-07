import * as React from 'react';
import './EarningInput.css'
import { Earning } from '../../../../../types/report/report';
import StandardFormLabeledInput from '../../../../forms/standardFormLabeledInput/StandardFormLabeledInput';
import StandardFormLabeledCurrencyInput from '../../../../forms/standardFormLabeledCurrencyInput/StandardFormLabeledCurrencyInput';

interface IEarningInputProps {
  earning: Earning,
  update: (earning: Earning) => void
}

/**
*
* @returns {JSX.Element | null}
*/
export default function EarningInput(props: IEarningInputProps): JSX.Element | null {

  const handleChangeAmount = (amount: number) => {
    const newEarning: Earning = { ...props.earning, amount: amount };
    props.update(newEarning);
  }

  const useCalculator = () => {

  }

  return (
    <div className='earning-input-wrapper transaction-input-wrapper'>
      <h3>{props.earning.category}</h3>
      <div className='standard-form-row'>
      <StandardFormLabeledCurrencyInput amount={props.earning.amount} update={handleChangeAmount} />
        <button className='standard-button' type='button' onClick={useCalculator}>calc</button>
      </div>
    </div>
  );
}