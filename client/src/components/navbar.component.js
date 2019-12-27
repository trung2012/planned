import React, { useContext, useState } from 'react';

import { AuthContext } from '../context/AuthContext';

import logo from '../assets/logo.png';
import './navbar.styles.scss';

const NavBar = () => {
  const { authState: { user }, signOut } = useContext(AuthContext);
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const handleSignOut = event => {
    signOut();
    setShowProfileOptions(false);
  }

  return (
    <nav className='navbar'>
      <div className='navbar__logo-container'>
        <img className='navbar__logo' src={logo} alt='logo' />
        <span className='navbar__logo-text'>Planned</span>
      </div>
      <div className='navbar__navigation'>
        {
          user &&
          <React.Fragment>
            <div className='navbar__navigation--welcome-message'>
              Welcome, {user.name}
            </div>
            <div
              className='navbar__navigation--profile-pic'
              style={{ backgroundColor: `${user.color}` }}
              onClick={() => setShowProfileOptions(!showProfileOptions)}
            >
              {user.initials}
            </div>
            {
              showProfileOptions &&
              <React.Fragment>
                <div className='overlay' onClick={() => setShowProfileOptions(false)}></div>
                <div className='navbar__navigation--profile-options'>
                  <div className='profile-options-item'>My account</div>
                  <div className='profile-options-item'>Change Password</div>
                  <div className='profile-options-item' onClick={handleSignOut}>Sign out</div>
                </div>
              </React.Fragment>
            }
          </React.Fragment>
        }
      </div>
    </nav>
  );
}

export default NavBar;