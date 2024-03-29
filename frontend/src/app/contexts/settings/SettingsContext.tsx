import * as React from 'react';
import { Result } from "../../../types/result/result"
import { UserSettings } from "../../../types/settings/userSettings"
import { LoadingSpinnerContext } from '../loadingSpinner/LoadingSpinnerContext';
import { SessionContext } from '../session/SessionContext';
import { SessionStatus } from '../../../types/session/session';
import { BrowseViewMode } from '../../../types/browse/browseViewMode';
import { Currency } from '../../../types/settings/currency';
import { useApi } from '../../../hooks/useApi/useApi';

type Props = {
  children: React.ReactNode
}

type Data = {
  settings: UserSettings | undefined,
  updateSettings: (settings: UserSettings) => Promise<Result>,
  refreshSettings: () => Promise<void>
}

const DEFAULT_SETTINGS: UserSettings = {
  general: {
    defaultViewMode: BrowseViewMode.DAY,
    currency: Currency.KRW
  },
  categories: {
    earnings: [],
    expenses: []
  },
  denominations: {
    denominations: []
  }
}

const DEFAULT_DATA: Data = {
  updateSettings: function (settings: UserSettings): Promise<Result<any>> {
    throw new Error("Function not implemented.");
  },
  settings: DEFAULT_SETTINGS,
  refreshSettings: function (): Promise<void> {
    throw new Error('Function not implemented.');
  }
}

export const SettingsContext = React.createContext<Data>(DEFAULT_DATA);
export const SettingsProvider = ({ children }: Props) => {

  const [ settings, setSettings ] = React.useState<UserSettings>();
  const { useLoading } = React.useContext(LoadingSpinnerContext);

  const { session } = React.useContext(SessionContext);

  const { api } = useApi();

  React.useEffect(() => {
    (async function fetchSettingsOnMount() {
      if (session.status === SessionStatus.LOCAL || session.status === SessionStatus.LOGGED_IN) {
        await useLoading(async () => {
          if (api == null) return Result.Fail().WithMessage('api not ready');
          const result = await api.settings.getSettings(session.token);
          if (result.wasSuccess && result.body != null) {
            setSettings(result.body);
          } else {
            setSettings(DEFAULT_SETTINGS);
          }
        })
      } else {
        setSettings(undefined);
      }
    })();
  }, [ session, api ]);

  const updateSettings = async (settings: UserSettings): Promise<Result> => {
    return await useLoading(async () => {
      if (api == null) return Result.Fail().WithMessage('api not ready');
      const result = await api.settings.updateSettings(session.token, settings);
      if (result.wasSuccess) {
        setSettings(settings);
      }
      return result;
    });
  }

  const refreshSettings = async (): Promise<void> => {
    if (api == null) return;
    await useLoading(async () => {
      const result = await api.settings.getSettings(session.token);
      if (result.wasSuccess && result.body != null) {
        setSettings(result.body);
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
    })
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, refreshSettings }} >
      { children }
    </SettingsContext.Provider>
  );
}