import * as React from 'react';

import { LoadingSpinnerProvider } from '../loadingSpinner/LoadingSpinnerContext';
import { SessionProvider } from '../session/SessionContext';
import { ReportsProvider } from '../reports/ReportsContext';

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
          {props.children}
        </ReportsProvider>
      </SessionProvider>
    </LoadingSpinnerProvider>
  );
}