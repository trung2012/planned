import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import UserProfilePicture from './user-profile-picture.component';
import MoreOptions from './more-options.component';
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
      <Link to='/' className='navbar__logo-container'>
        <img className='navbar__logo' src={logo} alt='logo' />
        <span className='navbar__logo-text'>Planned</span>
      </Link>
      <div className='navbar__navigation'>
        {
          user &&
          <React.Fragment>
            <div className='navbar__navigation--welcome-message'>
              Welcome, {user.name}
            </div>
            <UserProfilePicture
              backgroundColor={user.color}
              initials={user.initials}
              onClick={() => setShowProfileOptions(!showProfileOptions)}
            />
            {
              showProfileOptions &&
              <MoreOptions dismiss={() => setShowProfileOptions(false)}>
                <div className='more-options'>
                  <div className='more-options-item'>My account</div>
                  <div className='more-options-item'>Change Password</div>
                  <div className='more-options-item' onClick={handleSignOut}>Sign out</div>
                </div>
              </MoreOptions>
            }
          </React.Fragment>
        }
      </div>
    </nav>
  );
}

export default NavBar;