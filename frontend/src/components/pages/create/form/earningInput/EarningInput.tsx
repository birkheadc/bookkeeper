import * as React from 'react';
import './EarningInput.css'
import { Earning } from '../../../../../types/report/report';
import StandardFormLabeledInput from '../../../../forms/standardFormLabeledInput/StandardFormLabeledInput';
import StandardFormLabeledCurrencyInput from '../../../../forms/standardFormLabeledCurrencyInput/StandardFormLabeledCurrencyInput';
import { TrashIcon } from '@heroicons/react/24/outline';
import { CalculatorContext } from '../../../../../app/contexts/calculator/CalculatorContext';

interface IEarningInputProps {
  earning: Earning,
  update: (earning: Earning) => void,
  delete: () => void
}

/**
*
* @returns {JSX.Element | null}
*/
export default function EarningInput(props: IEarningInputProps): JSX.Element | null {
  const earning = props.earning;

  const handleChangeAmount = (amount: number) => {
    const newEarning = earning.copy();
    newEarning.amount = amount;
    props.update(newEarning);
  }

  const handleDeleteEarning = () => {
    props.delete();
  }

  return (
    <div className='earning-input-wrapper transaction-input-wrapper'>
      <div className="standard-form-row space-between">
        <h3>{props.earning.category}</h3>
        <button className='standard-button icon-button' onClick={handleDeleteEarning} type='button'><TrashIcon width={'1em'} /></button>
      </div>
      <div className='standard-form-row'>
        <StandardFormLabeledCurrencyInput amount={props.earning.amount} includeCalcButton update={handleChangeAmount} />
      </div>
    </div>
  );
}