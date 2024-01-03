import * as React from 'react';

import { LoadingSpinnerProvider } from '../loadingSpinner/LoadingSpinnerContext';
import { SessionProvider } from '../session/SessionContext';
import { ReportsProvider } from '../reports/ReportsContext';
import { SettingsProvider } from '../settings/SettingsContext';

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
        <ReportsProvider>
          <SettingsProvider>
            {props.children}
          </SettingsProvider>
        </ReportsProvider>
      </SessionProvider>
    </LoadingSpinnerProvider>
  );
}