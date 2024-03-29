import * as React from 'react';
import './ChangePasswordSection.css'
import { Result } from '../../../../types/result/result';
import ChangePasswordForm from './form/ChangePasswordForm';
import ResultDisplay from '../../../resultDisplay/ResultDisplay';
import { ChangePasswordRequest } from '../../../../types/settings/changePassword';
import { UsersContext } from '../../../../app/contexts/users/UsersContext';

interface IChangePasswordSectionProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function ChangePasswordSection(props: IChangePasswordSectionProps): JSX.Element | null {

  const [ recentResult, setRecentResult ] = React.useState<Result | undefined>(undefined);
  const { changePassword } = React.useContext(UsersContext);

  const submit = async (request: ChangePasswordRequest) => {
    const result = await changePassword(request);
    setRecentResult(result);
  }

  return (
    <section className='settings-section change-password-section-wrapper'>
      <h2>change password</h2>
      <ResultDisplay result={recentResult} />
      <ChangePasswordForm submit={submit} />  
    </section>
  );
}