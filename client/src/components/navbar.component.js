import React, { useContext } from 'react';

import { Context as AuthContext } from '../context/AuthContext';

import logo from '../assets/logo.png';
import './navbar.styles.scss';

const NavBar = () => {
  const { state } = useContext(AuthContext);

  return (
    <nav className='navbar'>
      <div className='navbar__logo-container'>
        <img className='navbar__logo' src={logo} alt='logo' />
        <span className='navbar__logo-text'>Planned</span>
      </div>
      <div className='navbar__navigation'>
        {
          state.user &&
          <>
            <div className='navbar__navigation--welcome-message'>
              Welcome, {state.user.name}
            </div>
            <div className='navbar__navigation--profile-pic'>
              {state.user.initials}
            </div>
          </>
        }
      </div>
    </nav>
  );
}

export default NavBar;