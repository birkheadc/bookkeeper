import * as React from 'react';
import { Result } from "../../../types/result/result"
import { ChangePasswordRequest } from "../../../types/settings/changePassword"
import { SessionContext } from '../session/SessionContext';
import { LoadingSpinnerContext } from '../loadingSpinner/LoadingSpinnerContext';
import { useApi } from '../../../hooks/useApi/useApi';

type Props = {
  children: React.ReactNode
}

type Data = {
  changePassword: (request: ChangePasswordRequest) => Promise<Result>
}

const DEFAULT_DATA: Data = {
  changePassword: function (request: ChangePasswordRequest): Promise<Result<any>> {
    throw new Error("Function not implemented.")
  }
}

export const UsersContext = React.createContext<Data>(DEFAULT_DATA);
export const UsersProvider = ({ children }: Props) => {

  const { session } = React.useContext(SessionContext);
  const { api } = useApi();

  const { useLoading } = React.useContext(LoadingSpinnerContext);

  const changePassword = async (request: ChangePasswordRequest): Promise<Result> => {
    return useLoading(async () => {
      if (api == null) return Result.Fail().WithMessage('api not ready');
      return await api.users.changePassword(session.token, request);
    });
  }

  return (
    <UsersContext.Provider value={{ changePassword }} >
      { children }
    </UsersContext.Provider>
  );
}