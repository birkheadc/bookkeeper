import * as React from 'react';
import './Calculator.css'
import { Denomination } from '../../../types/settings/userSettings';
import StandardFormLabeledInput from '../../../components/forms/standardFormLabeledInput/StandardFormLabeledInput';
import StandardFormLabeledCurrencyInput from '../../../components/forms/standardFormLabeledCurrencyInput/StandardFormLabeledCurrencyInput';
import { useCurrency } from '../../../hooks/useCurrency/useCurrency';
import { SettingsContext } from '../settings/SettingsContext';

interface ICalculatorProps {
  prev: number,
  updatePrev: (n: number) => void,
  submit: (n: number) => void
}

/**
*
* @returns {JSX.Element | null}
*/
export default function Calculator(props: ICalculatorProps): JSX.Element | null {

  const { settings, updateSettings } = React.useContext(SettingsContext);
  if (settings == null) return null;
  const denominations: Denomination[] = settings.denominations.denominations;

  const [ activeDenominations, setActiveDenominations ] = React.useState<Denomination[]>(settings.denominations.denominations.filter(d => d.isDefault));

  const { format } = useCurrency();
  const [ sum, setSum ] = React.useState<number>(props.prev);

  const [ values, setValues ] = React.useState<{[key: number]: number} | undefined>(undefined);

  React.useEffect(function initializeValues() {
    const newValues = { ...values };
    denominations.forEach(denomination => {
      newValues[denomination.value] = 0;
    });
    setValues(newValues);
  }, [ denominations ]);

  React.useEffect(function calculateSum() {
    if (values == null) return;
    let newSum = props.prev;
    denominations.forEach(denomination => {
      newSum += values[denomination.value] * denomination.value;
    })
    setSum(newSum);
  }, [ props.prev, values ]);

  // React.useEffect(function addRecenterListeners() {

  //   let height = window.visualViewport?.height ?? 0;

  //   const resizeListener = (event: Event) => {
  //     const visualViewport = event.currentTarget as VisualViewport | null;
  //     if (visualViewport == null) return;
  //     height = visualViewport.height;
  //   }

  //   const scrollListener = (event: Event) => {
  //     console.log(event);
  //   }

  //   window.visualViewport?.addEventListener('resize', resizeListener);
  //   window.addEventListener('scroll', scrollListener);

  //   return (() => {
  //     window.visualViewport?.removeEventListener('resize', resizeListener);
  //     window.removeEventListener('scroll', scrollListener);
  //   });
  // }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, denomination: number) => {
    const value = event.currentTarget.value === '' ? 0 : parseInt(event.currentTarget.value);
    if (isNaN(value) || value < 0) return;
    const newValues = { ...values };
    newValues[denomination] = value;
    setValues(newValues);
  }

  const handleChangePrev = (amount: number) => {
    props.updatePrev(amount);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    props.submit(sum);
  }

  const handleAddDenomination = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    if (value === 'default') return;
    const denomination: Denomination = { value: 0, isDefault: false };
    if (value === 'new') {
      const denominationValueString = prompt('Enter value for denomination');
      if (denominationValueString == null) return;
      const denominationValue = parseInt(denominationValueString);
      if (isNaN(denominationValue)) {
        alert('That is not a number.');
        return;
      }
      denomination.value = denominationValue
      if (!denominations.some(d => d.value === denominationValue)) {
        const newSettings = { ...settings };
        newSettings.denominations.denominations.push(denomination);
        updateSettings(newSettings);
      }
      setActiveDenominations(a => [ ...a, denomination ])
    }
    const valueInt = parseInt(value);
    if (isNaN(valueInt)) return;
    denomination.value = valueInt;
    if (!activeDenominations.some(d => d.value === valueInt)) setActiveDenominations(a => [...a, denomination ]);    
  }

  if (values == null) return null;

  return (
    <form className='standard-form calculator-wrapper' onSubmit={handleSubmit}>
      <div className='standard-form-row'><span className="calculator-total">Total: {format(sum)}</span></div>
      <StandardFormLabeledCurrencyInput label='previous' amount={props.prev} update={handleChangePrev} />
      {activeDenominations.map(
        (denomination, index) =>
        <StandardFormLabeledInput autofocus={index === 0} label={format(denomination.value)} type='number' key={`calculator-denomination-key-${denomination.value}`} name={`denomination-${denomination.value}`} value={values[denomination.value]?.toString() ?? 0} handleChange={(event) => handleChange(event, denomination.value)} />
      )}
      <select className='standard-input' onChange={handleAddDenomination} value='default'>
        <option value='default'>add denomination</option>
        {denominations.filter(d => !d.isDefault).map(
          denomination =>
          <option key={`denominations-select-key-${denomination.value}`} value={denomination.value}>{denomination.value.toLocaleString()}</option>
        )}
        <option value='new'>create new</option>
      </select>
      <button className='standard-button' type='submit'>submit</button>
    </form>
  );
}