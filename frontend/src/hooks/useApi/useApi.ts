import * as React from 'react';
import _api from "../../api";
import { SessionContext } from '../../app/contexts/session/SessionContext';
import { SessionStatus } from '../../types/session/session';

export function useApi(): { api: typeof _api.local | typeof _api.live | undefined } {
  const { session } = React.useContext(SessionContext);
  const [ api, setApi ] = React.useState<typeof _api.local | typeof _api.live | undefined>(undefined);

  React.useEffect(function setApiBasedOnSessionContext() {
    if (session.status === SessionStatus.CHECKING) {
      setApi(undefined);
      return;
    };
    if (session.status === SessionStatus.LOCAL) {
      setApi(_api.local);
      return;
    }
    setApi(_api.live);
  }, [ session ]);
  
  return { api };
}