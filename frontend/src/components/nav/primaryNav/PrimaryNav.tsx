import * as React from 'react';
import './PrimaryNav.css'
import { NavLink, useLocation } from 'react-router-dom';
import { SessionContext } from '../../../app/contexts/session/SessionContext';
import { SessionStatus } from '../../../types/session/session';

import { CalendarDaysIcon, MagnifyingGlassIcon, PlusIcon, AdjustmentsHorizontalIcon, ArrowRightStartOnRectangleIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';

interface IPrimaryNavProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function PrimaryNav(props: IPrimaryNavProps): JSX.Element | null {

  const { session } = React.useContext(SessionContext);
  const location = useLocation();

  React.useEffect(function unfocusLinkOnNavigate() {
    try {
      (document.activeElement as HTMLElement).blur();
    } catch {
      
    }
  }, [ location ]);

  return (
    <nav className='primary-nav-wrapper'>
      <div className='primary-nav-inner-wrapper'>
        { session.status === SessionStatus.LOGGED_IN
        ? LoggedInLinks
        : LoggedOutLinks
        }
      </div>
    </nav>
  );
}

const LoggedInLinks = (
  <ul>
    <li><NavLink to='/browse'><div className="nav-link-wrapper">
      <span className='nav-link-label'>
        <CalendarDaysIcon width={20} />
        browse
      </span></div></NavLink></li>
    <li><NavLink to='/detail'><div className="nav-link-wrapper">
      <span className='nav-link-label'>
        <MagnifyingGlassIcon width={20} />
        detail
      </span></div></NavLink></li>
    <li><NavLink to='/create'><div className="nav-link-wrapper">
      <span className='nav-link-label'>
        <PlusIcon width={20}/>
        create
      </span>
    </div></NavLink></li>
    <li><NavLink to='/settings'><div className="nav-link-wrapper">
      <span className='nav-link-label'>
        <AdjustmentsHorizontalIcon width={20} />
        settings
      </span></div></NavLink></li>
    <li><NavLink to='/logout'><div className="nav-link-wrapper">
      <span className='nav-link-label'>
        <ArrowRightStartOnRectangleIcon width={20} />
        logout
      </span></div></NavLink></li>
  </ul>
)

const LoggedOutLinks = (
  <ul>
    <li><NavLink to='/login'><div className="nav-link-wrapper">
    <span className='nav-link-label'>
        <ArrowRightEndOnRectangleIcon width={20} />
        login
      </span></div></NavLink></li>
  </ul>
)