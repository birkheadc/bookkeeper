import * as React from 'react';

import { LoadingSpinnerProvider } from '../loadingSpinner/LoadingSpinnerContext';
import { SessionProvider } from '../session/SessionContext';
import { ReportsProvider } from '../reports/ReportsContext';
import { SettingsProvider } from '../settings/SettingsContext';
import { UsersProvider } from '../users/UsersContext';

interface IAppProvidersProps {
  children: React.ReactNode
}

/**
*
* @returns {JSX.Element | null}
*/
export default function AppProviders(props: IAppProvidersProps): JSX.Element | null {
  return (
    <LoadingSpinnerProvider>
      <SessionProvider>
        <SettingsProvider>
          <ReportsProvider>
            <UsersProvider>
              {props.children}
            </UsersProvider>
          </ReportsProvider>
        </SettingsProvider>
      </SessionProvider>
    </LoadingSpinnerProvider>
  );
}