import * as React from 'react';
import './UpdateSettingsForm.css';
import { SettingsContext } from '../../../../app/contexts/settings/SettingsContext';
import { Result } from '../../../../types/result/result';
import { DenominationSettings, GeneralSettings, TransactionCategorySettings, UserSettings } from '../../../../types/settings/userSettings';
import ResultDisplay from '../../../resultDisplay/ResultDisplay';
import DenominationsSection from './denominations/DenominationsSection';
import GeneralSettingsSection from './generalSettings/GeneralSettingsSection';
import TransactionCategoriesSection from './transactionCategories/TransactionCategoriesSection';
import ChangePasswordSection from '../changePassword/ChangePasswordSection';

interface IUpdateSettingsFormProps {

}
/**
 * 
 * @param {} props
 * @returns {JSX.Element | null}
 */
export default function UpdateSettingsForm(props: IUpdateSettingsFormProps): JSX.Element | null {

  const [ recentResult, setRecentResult ] = React.useState<Result>();

  const { settings, updateSettings } = React.useContext(SettingsContext);
  const [ newSettings, setNewSettings ] = React.useState<UserSettings | undefined>(settings);

  React.useEffect(function populateNewSettingsWithCurrentSettings() {
    setNewSettings(settings);
  }, [ settings ]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newSettings != null) {
      const result = await updateSettings(newSettings);
      setRecentResult(result);
    }
  }

  const updateGeneralSettings = (generalSettings: GeneralSettings) => {
    setNewSettings(s => {
      return s ? { ...s, general: generalSettings } : undefined;
    });
  }

  const updateTransactionCategorySettings = (transactionCategorySettings: TransactionCategorySettings) => {
    setNewSettings(s => {
      return s ? { ...s, categories: transactionCategorySettings} : undefined;
    });
  }

  const updateDenominationSettings = (denominationSettings: DenominationSettings) => {
    setNewSettings(s => {
      return s ? { ...s, denominations: denominationSettings } : undefined
    });
  }

  if (newSettings == null) return null;

  return (
    <div className='settings-page-inner-wrapper'>
    <form className='update-settings-form-wrapper standard-form settings-section' onSubmit={handleSubmit}>
      <ResultDisplay result={recentResult} />
      <GeneralSettingsSection generalSettings={newSettings.general} updateGeneralSettings={updateGeneralSettings}/>
      <TransactionCategoriesSection transactionCategorySettings={newSettings.categories} updateTransactionCategorySettings={updateTransactionCategorySettings}/>
      <DenominationsSection denominationSettings={newSettings.denominations} updateDenominations={updateDenominationSettings} />
      <button className='standard-button' type='submit'>submit</button>
    </form>
    <ChangePasswordSection />
    </div>
  );
}