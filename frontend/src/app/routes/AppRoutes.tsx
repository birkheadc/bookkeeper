import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SessionContext } from '../contexts/session/SessionContext';
import { SessionStatus } from '../../types/session/session';
import LogoutPage from '../../components/pages/logout/LogoutPage';
import LoginPage from '../../components/pages/login/LoginPage';
import SettingsPage from '../../components/pages/settings/SettingsPage';
import LoadingPage from '../../components/pages/loading/LoadingPage';
import BrowsePage from '../../components/pages/browse/BrowsePage';
import CreatePage from '../../components/pages/create/CreatePage';
import DetailPage from '../../components/pages/detail/DetailPage';

interface IAppRoutesProps {

}
/**
 * 
 * @param {} props
 * @returns {JSX.Element | null}
 */
export default function AppRoutes(props: IAppRoutesProps): JSX.Element | null {

  const { session } = React.useContext(SessionContext);

  if (session.status === SessionStatus.CHECKING) {
    return (
      <Routes>
        <Route path='*' element={<LoadingPage />} />
      </Routes>
    )
  }

  return (
    <Routes>
      { session.status === SessionStatus.LOGGED_IN
      ? LoggedInRoutes
      : LoggedOutRoutes
      }
      { CommonRoutes }
    </Routes>
  );
}

const LoggedInRoutes = (
  <>
    <Route path='/browse' element={<BrowsePage />} />
    <Route path='/create' element={<CreatePage />} />
    <Route path='/detail' element={<DetailPage />} />
    <Route path='/settings' element={<SettingsPage />} />
    <Route path='/logout' element={<LogoutPage />} />
    <Route path='*' element={<Navigate replace to='/browse' />} />
  </>
);

const LoggedOutRoutes = (
  <>
    <Route path='/login' element={<LoginPage />} />
    <Route path='*' element={<Navigate replace to='/login' />} />
  </>
);

const CommonRoutes = (
  <>
    <Route path='*' element={<Navigate replace to='/' />} />
  </>
);