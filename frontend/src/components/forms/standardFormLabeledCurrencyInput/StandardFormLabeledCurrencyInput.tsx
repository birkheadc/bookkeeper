import * as React from 'react';
import './StandardFormLabeledCurrencyInput.css'
import CurrencyInput, { CurrencyInputOnChangeValues } from 'react-currency-input-field';
import { useCurrency } from '../../../hooks/useCurrency/useCurrency';
import { CalculatorContext } from '../../../app/contexts/calculator/CalculatorContext';
import { CalculatorIcon } from '@heroicons/react/24/outline';

interface IStandardFormLabeledCurrencyInputProps {
  amount: number,
  update: (amount: number) => void,
  includeCalcButton?: boolean | undefined
  label?: string | undefined
}

/**
*
* @returns {JSX.Element | null}
*/
export default function StandardFormLabeledCurrencyInput(props: IStandardFormLabeledCurrencyInputProps): JSX.Element | null {
  const { properties, getActualAmount, toDatabaseAmount, format } = useCurrency();
  const [ amount, setAmount ] = React.useState<string>(getActualAmount(props.amount).toString());

  const { useCalculator } = React.useContext(CalculatorContext);

  const handleChangeAmount = (_value: string | undefined, _name: string | undefined, values: CurrencyInputOnChangeValues | undefined) => {
    const value = values?.float;
    setAmount(_value ?? '0');
    props.update(toDatabaseAmount(value));
  }

  const openCalculator = async () => {
    await useCalculator(props.amount, (n) => {
      setAmount((getActualAmount(n)).toString());
      props.update(n);
    });
  }

  return (
    <>
      <div className='standard-form-labeled-input-outer-wrapper'>
        <div className='standard-form-labeled-input-wrapper'>
          <label>{props.label ?? 'amount'}</label>
          <CurrencyInput className='standard-input' allowDecimals={properties.decimals !== 0} decimalsLimit={properties.decimals} prefix={properties.symbol} allowNegativeValue={false} maxLength={'999999999999999'.length} onValueChange={handleChangeAmount} value={amount}/>
        </div>
      </div>
      { props.includeCalcButton && <button className='standard-button' type='button' onClick={openCalculator}><CalculatorIcon width={'20px'}/></button>}
    </>
  );
}