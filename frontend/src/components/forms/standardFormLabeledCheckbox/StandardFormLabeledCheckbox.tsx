import * as React from 'react';
import './StandardFormLabeledCheckbox.css';

interface IStandardFormLabeledCheckboxProps {
  label: string,
  name: string,
  checked: boolean,
  handleToggle: () => void
}
/**
 * 
 * @param {} props
 * @returns {JSX.Element | null}
 */
export default function StandardFormLabeledCheckbox(props: IStandardFormLabeledCheckboxProps): JSX.Element | null {
  return (
    <div className='standard-form-labeled-checkbox-outer-wrapper' onClick={props.handleToggle}>
      <div className='standard-form-labeled-checkbox-wrapper'>
        <label htmlFor={props.name}>{props.label}</label>
        <input id={props.name} name={props.name} checked={props.checked} type='checkbox' readOnly></input>
      </div>
    </div>
  );
}