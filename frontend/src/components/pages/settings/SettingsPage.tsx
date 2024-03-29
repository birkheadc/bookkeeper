import * as React from 'react';
import './SettingsPage.css'
import UpdateSettingsForm from './form/UpdateSettingsForm';

interface ISettingsPageProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function SettingsPage(props: ISettingsPageProps): JSX.Element | null {
  return (
    <main className='settings-page-wrapper'>
      <h1>settings</h1>
      <UpdateSettingsForm />
    </main>
  );
}