import * as React from 'react';
import './StandardFormLabeledCurrencyInput.css'
import CurrencyInput, { CurrencyInputOnChangeValues } from 'react-currency-input-field';
import settings from '../../../api/settings';
import { Currency } from '../../../types/settings/currency';
import { useCurrency } from '../../../hooks/useCurrency/useCurrency';

interface IStandardFormLabeledCurrencyInputProps {
  amount: number,
  update: (amount: number) => void
}

/**
*
* @returns {JSX.Element | null}
*/
export default function StandardFormLabeledCurrencyInput(props: IStandardFormLabeledCurrencyInputProps): JSX.Element | null {
  const { properties, getActualAmount, toDatabaseAmount } = useCurrency();
  const [ amount, setAmount ] = React.useState<string>(getActualAmount(props.amount).toString());

  const handleChangeAmount = (_value: string | undefined, _name: string | undefined, values: CurrencyInputOnChangeValues | undefined) => {
    const value = values?.float;
    setAmount(_value ?? '0');
    props.update(toDatabaseAmount(value));
  }

  return (
    <div className='standard-form-labeled-input-outer-wrapper'>
      <div className='standard-form-labeled-input-wrapper'>
        <label>Amount</label>
        <CurrencyInput allowDecimals={properties.decimals !== 0} decimalsLimit={properties.decimals} prefix={properties.symbol} allowNegativeValue={false} maxLength={'999999999999999'.length} onValueChange={handleChangeAmount} value={amount}/>
      </div>
    </div>
  );
}