import * as React from 'react';
import { Result } from "../../../types/result/result"
import { ChangePasswordRequest } from "../../../types/settings/changePassword"
import { SessionContext } from '../session/SessionContext';
import { SessionStatus } from '../../../types/session/session';
import api from '../../../api';
import { LoadingSpinnerContext } from '../loadingSpinner/LoadingSpinnerContext';

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
  const _api = session.status === SessionStatus.LOCAL ? api.local : api;

  const { useLoading } = React.useContext(LoadingSpinnerContext);

  const changePassword = async (request: ChangePasswordRequest): Promise<Result> => {
    return useLoading(async () => {
      return await _api.users.changePassword(session.token, request);
    });
  }

  return (
    <UsersContext.Provider value={{ changePassword }} >
      { children }
    </UsersContext.Provider>
  );
}