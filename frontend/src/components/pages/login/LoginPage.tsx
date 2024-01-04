import * as React from 'react';
import './LoginPage.css'
import LoginForm from './form/LoginForm';
import { LoginCredentials } from '../../../types/credentials/loginCredentials';
import { Link } from 'react-router-dom';
import { LoadingSpinnerContext } from '../../../app/contexts/loadingSpinner/LoadingSpinnerContext';
import api from '../../../api';
import ResultDisplay from '../../resultDisplay/ResultDisplay';
import { Result } from '../../../types/result/result';
import { SessionContext } from '../../../app/contexts/session/SessionContext';
import { SessionStatus } from '../../../types/session/session';

interface ILoginPageProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function LoginPage(props: ILoginPageProps): JSX.Element | null {

  const [ recentResult, setRecentResult ] = React.useState<Result | undefined>(undefined);
  const { useLoading } = React.useContext(LoadingSpinnerContext);
  const { session, login, loginLocal } = React.useContext(SessionContext);

  const submit = async (request: LoginCredentials) => {
    await useLoading(async () => {
      const result = await api.auth.login(request);
      setRecentResult(result);
      if (result.wasSuccess) {
        login(result.body);
      }
    })
  }

  const handleLoginLocal = () => {
    const conf = confirm('This application is meant to be used only by the admin; local login is for demo purposes only.\n\nWhen logged in locally, all data is stored on your device, and might be lost at any time.\n\nPlease do not attempt to use this app for actual book-keeping.\n\nContinue in demo mode?');
    if (conf) {
      loginLocal();
    }
  }

  return (
    <main className='login-page-wrapper'>
      <h1>login</h1>
      {session.status === SessionStatus.EXPIRED && <span className='login-expired-message'>Your session has expired. Please log in again.</span>}
      <ResultDisplay result={recentResult} />
      <LoginForm submit={submit} />
      <span className='local-login-invitation'>Or, <button className='link-button' type='button' onClick={handleLoginLocal}>log in locally</button></span>
    </main>
  );
}