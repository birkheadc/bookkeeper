import * as React from 'react';
import './GeneralSettingsSection.css'
import { GeneralSettings } from '../../../../../types/settings/userSettings';
import { BrowseViewMode } from '../../../../../types/browse/browseViewMode';

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
    })
  }

  return (
    <section className='general-settings-section-wrapper settings-sub-section'>
      <h2>general</h2>
      <div className='standard-form-row default-view-mode-section'>
        <label>Default View Mode</label>
        <button className={`standard-button${settings.defaultViewMode === BrowseViewMode.DAY ? ' active' : ''}`} name='day' type='button' onClick={changeViewMode}>day</button>
        <button className={`standard-button${settings.defaultViewMode === BrowseViewMode.WEEK ? ' active' : ''}`} name='week' type='button' onClick={changeViewMode}>week</button>
        <button className={`standard-button${settings.defaultViewMode === BrowseViewMode.MONTH ? ' active' : ''}`} name='month' type='button' onClick={changeViewMode}>month</button>
      </div>
    </section>
  );
}