import * as React from 'react';
import './UpdateSettingsForm.css';
import { SettingsContext } from '../../../../app/contexts/settings/SettingsContext';
import { Result } from '../../../../types/result/result';
import { GeneralSettings, UserSettings } from '../../../../types/settings/userSettings';
import ResultDisplay from '../../../resultDisplay/ResultDisplay';
import DenominationsSection from './denominations/DenominationsSection';
import GeneralSettingsSection from './generalSettings/GeneralSettingsSection';
import TransactionCategoriesSection from './transactionCategories/TransactionCategoriesSection';

interface IUpdateSettingsFormProps {

}
/**
 * 
 * @param {} props
 * @returns {JSX.Element | null}
 */
export default function UpdateSettingsForm(props: IUpdateSettingsFormProps): JSX.Element | null {

  const [ settings, setSettings ] = React.useState<UserSettings>();
  const [ recentResult, setRecentResult ] = React.useState<Result>();

  const { getSettings, updateSettings } = React.useContext(SettingsContext);

  React.useEffect(() => {
    (async function getSettingsOnMount() {
      const result = await getSettings();
      setRecentResult(result);
      if (result.wasSuccess && result.body != null) {
        setSettings(result.body);
      }
    })();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (settings != null) updateSettings(settings);
  }

  const updateGeneralSettings = (generalSettings: GeneralSettings) => {
    setSettings(s => {
      return s ? { ...s, general: generalSettings } : undefined
    });
  }

  return (
    <form className='update-settings-form-wrapper standard-form'>
      <ResultDisplay result={recentResult} />
      <GeneralSettingsSection generalSettings={settings?.general} updateGeneralSettings={updateGeneralSettings}/>
      <TransactionCategoriesSection />
      <DenominationsSection />
      <button className='standard-button' type='submit'>submit</button>
    </form>
  );
}