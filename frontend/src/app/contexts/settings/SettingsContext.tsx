import * as React from 'react';
import { Result } from "../../../types/result/result"
import { UserSettings } from "../../../types/settings/userSettings"
import { LoadingSpinnerContext } from '../loadingSpinner/LoadingSpinnerContext';
import { SessionContext } from '../session/SessionContext';
import api from '../../../api';
import { SessionStatus } from '../../../types/session/session';

type Props = {
  children: React.ReactNode
}

type Data = {
  getSettings: () => Promise<Result<UserSettings>>,
  updateSettings: (settings: UserSettings) => Promise<Result>
}

const DEFAULT_DATA: Data = {
  getSettings: function (): Promise<Result<UserSettings>> {
    throw new Error("Function not implemented.")
  },
  updateSettings: function (settings: UserSettings): Promise<Result<any>> {
    throw new Error("Function not implemented.")
  }
}

export const SettingsContext = React.createContext<Data>(DEFAULT_DATA);
export const SettingsProvider = ({ children }: Props) => {

  const [ settings, setSettings ] = React.useState<UserSettings>();
  const { useLoading } = React.useContext(LoadingSpinnerContext);

  const { session } = React.useContext(SessionContext);

  const _api = session.status === SessionStatus.LOCAL ? api.local : api;

  React.useEffect(function clearCacheOnChangeInSession() {
    setSettings(undefined);
  }, [ session ]);

  const getSettings = async (): Promise<Result<UserSettings>> => {
    return await useLoading(async () => {
      if (settings != null) return Result.Succeed().WithBody(settings);
      const result = await _api.settings.getSettings(session.token);
      if (!result.wasSuccess || result.body == null) {
        return Result.Fail().WithErrors(result.errors).WithMessage('Failed to retrieve settings.')
      }
      setSettings(result.body);
      return Result.Succeed().WithBody(result.body);
    });
  }

  const updateSettings = async (settings: UserSettings): Promise<Result> => {
    return Result.Fail().WithMessage('Not yet implemented.');
  }

  const clearCache = () => {
    
  }

  return (
    <SettingsContext.Provider value={{ getSettings, updateSettings }} >
      { children }
    </SettingsContext.Provider>
  );
}