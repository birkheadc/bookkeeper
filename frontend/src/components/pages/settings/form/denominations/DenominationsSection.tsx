import * as React from 'react';
import './DenominationsSection.css'
import { DenominationSettings } from '../../../../../types/settings/userSettings';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import StandardFormLabeledCheckbox from '../../../../forms/standardFormLabeledCheckbox/StandardFormLabeledCheckbox';

interface IDenominationsSectionProps {
  denominationSettings: DenominationSettings,
  updateDenominations: (settings: DenominationSettings) => void
}

/**
*
* @returns {JSX.Element | null}
*/
export default function DenominationsSection(props: IDenominationsSectionProps): JSX.Element | null {
  const settings = props.denominationSettings
  
  if (settings == null) return null;

  const handleToggle = (value: number) => {
    const denomination = settings.denominations.find(d => d.value === value);
    if (denomination == null) return;
    denomination.isDefault = !denomination.isDefault;
    props.updateDenominations(settings);
  }

  const handleAddNew = () => {
    const valueString = prompt('Enter name of new denomination.');
    if (valueString == null) return;
    const value = parseInt(valueString);
    if (isNaN(value)) alert('Invalid');

    const doesExist = settings.denominations.some(d => d.value === value);

    if (doesExist) {
      alert('That denomination already exists!');
      return;
    }

    settings.denominations.push({
      value: value,
      isDefault: false
    });
    props.updateDenominations(settings);
  }

  const handleDelete = (value: number) => {
    const newDenominations = settings.denominations.filter(d => d.value !== value);
    const newSettings = { ...settings, denominations: newDenominations };
    props.updateDenominations(newSettings);
  }

  return (
    <section className='denominations-section-wrapper settings-sub-section'>
      <h2>default denominations</h2>
      {settings.denominations.map(
        denomination =>
        <div key={`denomination-key-${denomination.value}`} className='standard-form-row'>
            <StandardFormLabeledCheckbox label={denomination.value.toLocaleString()} name={`denomination-${denomination.value}`} checked={denomination.isDefault} handleToggle={() => handleToggle(denomination.value)} />
            <button className='standard-button icon-button' type='button' onClick={() => handleDelete(denomination.value)}><TrashIcon width={'20px'}/> delete</button>
          </div>
      )}
      <button className='standard-button icon-button' type='button' onClick={() => handleAddNew()}><PlusIcon width={'20px'} />new</button>
    </section>
  );
}