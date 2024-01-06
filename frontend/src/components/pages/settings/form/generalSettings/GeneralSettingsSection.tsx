import * as React from 'react';
import './GeneralSettingsSection.css'
import { GeneralSettings } from '../../../../../types/settings/userSettings';
import { BrowseViewMode } from '../../../../../types/browse/browseViewMode';
import { Currency } from '../../../../../types/settings/currency';

interface IGeneralSettingsSectionProps {
  generalSettings: GeneralSettings,
  updateGeneralSettings: (settings: GeneralSettings) => void
}

/**
*
* @returns {JSX.Element | null}
*/
export default function GeneralSettingsSection(props: IGeneralSettingsSectionProps): JSX.Element | null {
  const settings = props.generalSettings;

  const changeViewMode = (event: React.PointerEvent<HTMLButtonElement>) => {
    const name = event.currentTarget.name;
    props.updateGeneralSettings({
      ...settings,
      defaultViewMode: name as BrowseViewMode
    });
  }

  const changeCurrency = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    props.updateGeneralSettings({
      ...settings,
      currency: value as Currency
    });
  }

  return (
    <section className='general-settings-section-wrapper settings-sub-section'>
      <h2>general</h2>
      <div className='general-settings-section-inner-wrapper'>
        <div className='standard-form-row default-view-mode-section'>
          <label>Default View Mode</label>
          <div className='default-view-mode-buttons'>
            <button className={`standard-button${settings.defaultViewMode === BrowseViewMode.DAY ? ' active' : ''}`} name='day' type='button' onClick={changeViewMode}>day</button>
            <button className={`standard-button${settings.defaultViewMode === BrowseViewMode.WEEK ? ' active' : ''}`} name='week' type='button' onClick={changeViewMode}>week</button>
            <button className={`standard-button${settings.defaultViewMode === BrowseViewMode.MONTH ? ' active' : ''}`} name='month' type='button' onClick={changeViewMode}>month</button>
          </div>
        </div>
        <div className='standard-form-row currency-section'>
          <label>Currency</label> 
          <select className='standard-input' value={settings.currency} onChange={changeCurrency}>
            { Object.keys(Currency).map(
              currency =>
              <option key={`currency-option-key-${currency}`}>{currency}</option>
            ) }
          </select>
        </div>
      </div>
    </section>
  );
}